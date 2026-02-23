import { NoticeCategory, NoticeStatus } from "@/libs/enums/notice.enum";

export interface NoticeUpdate {
  _id: string;
  noticeCategory?: NoticeCategory;
  noticeStatus?: NoticeStatus;
  noticeTitle?: string;
  noticeContent?: string;
}
