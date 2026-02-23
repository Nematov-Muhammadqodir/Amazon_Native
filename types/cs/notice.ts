import {
  NoticeCategory,
  NoticeFor,
  NoticeStatus,
} from "@/libs/enums/notice.enum";

export interface Notice {
  _id: string;
  noticeCategory: NoticeCategory;
  noticeStatus: NoticeStatus;
  noticeTitle: string;
  noticeContent: string;
  noticeFor: NoticeFor;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
}
