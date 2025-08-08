import type { NextRequest } from 'next/server'
import { GET } from '../route'

jest.mock('@clerk/nextjs/server', () => ({ currentUser: jest.fn() }))
jest.mock('@/lib/prisma', () => ({
  prisma: {
    matchRequest: { findMany: jest.fn(), findUnique: jest.fn() },
    message: { findMany: jest.fn() },
  },
}))
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init: { status?: number } = {}) => ({
      json: () => Promise.resolve(data),
      status: init.status ?? 200,
    }),
  },
  NextRequest: class {},
}))

import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

describe('GET /api/messages', () => {
  it('returns messages for the current user when no matchRequestId is provided', async () => {
    ;(currentUser as jest.Mock).mockResolvedValue({ id: 'user1' })
    ;(prisma.matchRequest.findMany as jest.Mock).mockResolvedValue([{ id: 'm1' }, { id: 'm2' }])
    ;(prisma.message.findMany as jest.Mock).mockResolvedValue([
      { id: 'msg1', matchId: 'm1', senderId: 'user1', sender: { id: 'user1' } },
    ])

    const req = { url: 'http://localhost/api/messages' } as unknown as NextRequest
    const res = await GET(req)

    expect(prisma.matchRequest.findMany).toHaveBeenCalledWith({
      where: { OR: [{ athleteId: 'user1' }, { recruiterId: 'user1' }], status: 'accepted' },
      select: { id: true },
    })
    expect(prisma.message.findMany).toHaveBeenCalledWith({
      where: { matchId: { in: ['m1', 'm2'] } },
      include: { sender: true },
      orderBy: { createdAt: 'asc' },
    })
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual([
      { id: 'msg1', matchId: 'm1', senderId: 'user1', sender: { id: 'user1' } },
    ])
  })
})
