export async function copyMentorContactValue(value: string) {
  if (
    typeof navigator === "undefined" ||
    !navigator.clipboard?.writeText
  ) {
    throw new Error(
      "Trình duyệt chưa cấp quyền sao chép.",
    );
  }
  await navigator.clipboard.writeText(value);
}
