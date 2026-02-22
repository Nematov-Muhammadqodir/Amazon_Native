import { JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  memberType: string;
  memberStatus: string;
  memberAuthType: string;
  memberPhone: string;
  memberNick: string;
  memberFullName?: string;
  memberImage?: any;
  memberAddress?: string;
  memberDesc?: string;
  memberProperties: number;
  memberRank: number;
  memberArticles: number;
  memberPoints: number;
  memberLikes: number;
  memberViews: number;
  memberWarnings: number;
  memberBlocks: number;
}
