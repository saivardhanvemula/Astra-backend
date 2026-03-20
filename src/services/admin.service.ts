import * as adminDb from "../dbhelpers/admin.db";

export async function getDashboardSummary() {
  return adminDb.getDashboardSummary();
}

export async function getExpiringMembers() {
  return adminDb.getExpiringMembers();
}

export async function getRecentMembers() {
  return adminDb.getRecentMembers();
}

export async function getWeeklyCheckins() {
  return adminDb.getWeeklyCheckins();
}
