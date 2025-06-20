import { Permission, Role, User } from '@/app/generated/prisma'
import { prisma } from './prisma'

export interface UserWithRoles extends User {
  userRoles: {
    role: Role & {
      rolePermissions: {
        permission: Permission
      }[]
    }
  }[]
}

export class RBACService {
  // 获取用户所有权限
  static async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!user) return []

    const permissions: Permission[] = []
    const permissionIds = new Set<string>()

    user.userRoles.forEach(userRole => {
      userRole.role.rolePermissions.forEach(rolePermission => {
        if (!permissionIds.has(rolePermission.permission.id)) {
          permissions.push(rolePermission.permission)
          permissionIds.add(rolePermission.permission.id)
        }
      })
    })

    return permissions
  }

  // 检查用户是否有特定权限
  static async hasPermission(
    userId: string, 
    resource: string, 
    action: string
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    return permissions.some(p => p.resource === resource && p.action === action)
  }

  // 检查用户是否有任意一个权限
  static async hasAnyPermission(
    userId: string, 
    permissionChecks: { resource: string; action: string }[]
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    return permissionChecks.some(check =>
      permissions.some(p => p.resource === check.resource && p.action === check.action)
    )
  }

  // 为用户分配角色
  static async assignRoleToUser(userId: string, roleId: string) {
    return await prisma.userRole.create({
      data: { userId, roleId }
    })
  }

  // 移除用户角色
  static async removeRoleFromUser(userId: string, roleId: string) {
    return await prisma.userRole.deleteMany({
      where: { userId, roleId }
    })
  }

  // 为角色分配权限
  static async assignPermissionToRole(roleId: string, permissionId: string) {
    return await prisma.rolePermission.create({
      data: { roleId, permissionId }
    })
  }

  // 移除角色权限
  static async removePermissionFromRole(roleId: string, permissionId: string) {
    return await prisma.rolePermission.deleteMany({
      where: { roleId, permissionId }
    })
  }
}
