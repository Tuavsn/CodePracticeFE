import { User } from "@/types/user";

export const mockUsers: Partial<User>[] = [
  {
    id: "1",
    username: "admin_user",
    email: "admin@example.com",
    avatar: "https://scontent.fsgn20-1.fna.fbcdn.net/v/t39.30808-6/500439335_2416803845370384_5401287515161469895_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=PqenO7GGY_oQ7kNvwHL_s5r&_nc_oc=AdnrCJOIVD-s6gZQMpiBZCfmWAtlze5BRZTk_-pWpGfQ_sA6oD-h_SSOoPKEEgVHsaQZZUMWEj8Hv3Lq0sMpqzcO&_nc_zt=23&_nc_ht=scontent.fsgn20-1.fna&_nc_gid=nfpU4Ce8dx_DcNSXTgvzKw&oh=00_AfMtIL63Z2lzNamdcfjW9e0fVaKfAJ7GjIp1gUJE2qcG5g&oe=686BB27A",
    role: "admin",
    phone: "0123456789",
    address: "123 Admin Street",
    achievement: "EXPERT",
    totalSubmissionPoint: 1200,
    status: "ACTIVE",
    authProvider: "LOCAL",
    devices: [
      {
        info: "Chrome on Windows",
        ip: "192.168.1.10",
        expireAt: new Date("2025-12-31"),
        lastLoginTime: new Date("2025-06-08T10:00:00"),
      }
    ]
  },
  {
    id: "2",
    username: "jane_smith",
    email: "jane@example.com",
    avatar: "https://scontent.fsgn20-1.fna.fbcdn.net/v/t39.30808-6/500439335_2416803845370384_5401287515161469895_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=PqenO7GGY_oQ7kNvwHL_s5r&_nc_oc=AdnrCJOIVD-s6gZQMpiBZCfmWAtlze5BRZTk_-pWpGfQ_sA6oD-h_SSOoPKEEgVHsaQZZUMWEj8Hv3Lq0sMpqzcO&_nc_zt=23&_nc_ht=scontent.fsgn20-1.fna&_nc_gid=nfpU4Ce8dx_DcNSXTgvzKw&oh=00_AfMtIL63Z2lzNamdcfjW9e0fVaKfAJ7GjIp1gUJE2qcG5g&oe=686BB27A",
    role: "moderator",
    phone: "0987654321",
    address: "456 Moderator Avenue",
    achievement: "INTERMEDIATE",
    totalSubmissionPoint: 800,
    status: "ACTIVE",
    authProvider: "GOOGLE",
    devices: [
      {
        info: "Safari on iPhone",
        ip: "10.0.0.2",
        expireAt: new Date("2025-11-01"),
        lastLoginTime: new Date("2025-06-07T12:30:00"),
      }
    ]
  },
  {
    id: "3",
    username: "john_doe",
    email: "john@example.com",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_gaxAkYYDw8UfNleSC2Viswv3xSmOa4bIAQ&s",
    role: "user",
    phone: "0111222333",
    address: "789 User Road",
    achievement: "BEGINNER",
    totalSubmissionPoint: 300,
    status: "ACTIVE",
    authProvider: "LOCAL",
    devices: [
      {
        info: "Edge on Windows",
        ip: "172.16.5.1",
        expireAt: new Date("2025-08-20"),
        lastLoginTime: new Date("2025-06-06T09:00:00"),
      }
    ]
  },
  {
    id: "4",
    username: "banned_user",
    email: "banned@example.com",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_gaxAkYYDw8UfNleSC2Viswv3xSmOa4bIAQ&s",
    role: "user",
    phone: "0222333444",
    address: "999 Blocked Lane",
    achievement: "BEGINNER",
    totalSubmissionPoint: 0,
    status: "BANNED",
    authProvider: "LOCAL",
    devices: [
      {
        info: "Firefox on Linux",
        ip: "192.168.100.100",
        expireAt: new Date("2025-07-01"),
        lastLoginTime: new Date("2025-06-01T14:00:00"),
      }
    ]
  }
];
