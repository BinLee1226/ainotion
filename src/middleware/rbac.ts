import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { RBACService } from '@/lib/rbac'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
  }
}

// JWT 验证中间件
export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: AuthenticatedRequest) => {
    try {
      const token = req.headers.get('authorization')?.replace('Bearer ', '')
      
      if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      req.user = decoded

      return await handler(req)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  }
}

// 权限验证中间件
export function withPermission(
  resource: string, 
  action: string,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(async (req: AuthenticatedRequest) => {
    try {
      const hasPermission = await RBACService.hasPermission(
        req.user!.id, 
        resource, 
        action
      )

      if (!hasPermission) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      return await handler(req)
    } catch (error) {
      return NextResponse.json({ error: 'Permission check failed' }, { status: 500 })
    }
  })
}

// 多权限验证中间件（满足任一权限即可）
export function withAnyPermission(
  permissionChecks: { resource: string; action: string }[],
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(async (req: AuthenticatedRequest) => {
    try {
      const hasPermission = await RBACService.hasAnyPermission(
        req.user!.id, 
        permissionChecks
      )

      if (!hasPermission) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      return await handler(req)
    } catch (error) {
      return NextResponse.json({ error: 'Permission check failed' }, { status: 500 })
    }
  })
}
