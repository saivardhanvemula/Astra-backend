import { Request, Response, NextFunction } from "express";
import * as memberService from "../services/member.service";

export async function createMember(req: Request, res: Response, next: NextFunction) {
  try {
    const member = await memberService.createMember({
      ...req.body,
      created_by: (req as any).user?.id,
    });
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

export async function getAllMembers(_req: Request, res: Response, next: NextFunction) {
  try {
    const members = await memberService.getAllMembers();
    res.json({ success: true, count: members.length, data: members });
  } catch (err) {
    next(err);
  }
}

export async function getMemberById(req: Request, res: Response, next: NextFunction) {
  try {
    const member = await memberService.getMemberById(req.params.id);
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

// GET /api/members/me — member sees their own membership info
export async function getMyMembership(req: Request, res: Response, next: NextFunction) {
  try {
    const email = (req as any).user?.email;
    if (!email) return res.status(401).json({ error: "Unauthorized" });
    const data = await memberService.getMyMembership(email);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// POST /api/members/join — public gym join form (no auth)
export async function joinGym(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await memberService.joinGym(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// PUT /api/members/:id — admin only
export async function updateMember(req: Request, res: Response, next: NextFunction) {
  try {
    const member = await memberService.updateMember(req.params.id, req.body);
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/members/:id — admin only
export async function deleteMember(req: Request, res: Response, next: NextFunction) {
  try {
    await memberService.deleteMember(req.params.id);
    res.json({ success: true, message: "Member deleted successfully" });
  } catch (err) {
    next(err);
  }
}
