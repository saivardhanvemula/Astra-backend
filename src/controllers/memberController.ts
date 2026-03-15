import { Request, Response, NextFunction } from 'express';
import { memberService, CreateMemberInput } from '../services/memberService';

export const memberController = {
  async createMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const member = await memberService.createMember(req.body as CreateMemberInput);
      res.status(201).json({
        success: true,
        message: 'Member registered successfully.',
        data: member,
      });
    } catch (err) {
      next(err);
    }
  },

  async getAllMembers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const members = await memberService.getAllMembers();
      res.status(200).json({
        success: true,
        count: members.length,
        data: members,
      });
    } catch (err) {
      next(err);
    }
  },
};
