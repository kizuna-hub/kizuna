import type { AiWorkspaceMessage } from "../../types/ai-workspace.types";
import { CAMPUSFLOW_MENTOR_CONVERSATION_IDS } from "./mentor-conversation-seed-ids";
import { createCampusFlowMentorConversationSources } from "./mentor-conversation-source-seed";

function founderMessage(
  id: string,
  content: string,
  createdAt: string,
): AiWorkspaceMessage {
  return {
    id,
    role: "founder",
    content,
    createdAt,
    status: "complete",
  };
}

function assistantMessage(
  id: string,
  content: string,
  createdAt: string,
  sourceIds: string[] = [],
): AiWorkspaceMessage {
  const sourcesById = new Map(
    createCampusFlowMentorConversationSources().map((source) => [
      source.id,
      source,
    ]),
  );

  return {
    id,
    role: "assistant",
    content,
    createdAt,
    status: "complete",
    responseKind: "conversation",
    responseLifecycle: "completed",
    thinkingDurationSeconds: 3,
    sources: sourceIds.map((sourceId) => {
      const source = sourcesById.get(sourceId);
      return {
        id: sourceId,
        label: source?.title ?? sourceId,
        status:
          source?.verificationStatus === "inferred"
            ? ("inferred" as const)
            : source?.verificationStatus === "self_declared"
              ? ("assumed" as const)
              : source?.verificationStatus === "unverified"
                ? ("missing" as const)
                : ("verified" as const),
      };
    }),
  };
}

export function createCampusFlowMentorConversationMessages(): Record<
  string,
  AiWorkspaceMessage[]
> {
  return {
    [CAMPUSFLOW_MENTOR_CONVERSATION_IDS[0]]: [
      founderMessage(
        "history-priority-founder-1",
        "Vì sao Kizuna ưu tiên anh Trần Minh Quân cho CampusFlow?",
        "2026-08-03T09:00:00.000Z",
      ),
      assistantMessage(
        "history-priority-assistant-1",
        `Anh Trần Minh Quân được ưu tiên vì nhu cầu hiện tại của CampusFlow không còn là xây thêm tính năng, mà là chuyển sự quan tâm của hai câu lạc bộ thành một pilot có phạm vi và cách đo rõ ràng.

Kinh nghiệm của anh Quân phù hợp ở ba điểm:

• Thiết kế pilot: xác định phạm vi thử nghiệm, success metric và evidence cần thu thập.
• Product validation: phân biệt tín hiệu quan tâm với commitment đủ để triển khai.
• Startup sinh viên: tập trung vào một outcome nhỏ, phù hợp nguồn lực hiện tại của CampusFlow.

Sau một phiên trao đổi, outcome hợp lý nhất là chốt một câu lạc bộ cho pilot đầu tiên, phạm vi 14 ngày, một success metric chính và evidence cần thu thập.

Đây là matching do Kizuna suy luận từ context của CampusFlow, không phải đánh giá anh Quân tốt hơn các mentor còn lại.`,
        "2026-08-03T09:03:00.000Z",
        [
          "mentor-quan-kizuna-profile",
          "mentor-quan-self-declared",
          "campusflow-venture-brief",
          "mentor-priority-kizuna-inference",
        ],
      ),
      founderMessage(
        "history-priority-founder-2",
        "Chị Hà cũng làm product research. Tại sao không ưu tiên chị Hà?",
        "2026-08-03T09:12:00.000Z",
      ),
      assistantMessage(
        "history-priority-assistant-2",
        `Chị Hà cũng phù hợp, nhưng cho một outcome khác.

Chị Hà nên được ưu tiên khi team muốn phân tách rõ nhu cầu của trưởng câu lạc bộ và thành viên mới, thiết kế lại vòng customer discovery hoặc kiểm tra insight từ năm người đã dùng prototype.

Anh Quân phù hợp hơn với câu hỏi hiện tại: “Làm thế nào để biến pilot interest thành một thử nghiệm có thể bắt đầu?”

Nếu pilot cho thấy user segment hoặc problem framing chưa đủ rõ, chị Hà sẽ là Specialist Mentor phù hợp hơn.`,
        "2026-08-03T09:18:00.000Z",
        [
          "mentor-ha-kizuna-profile",
          "campusflow-venture-brief",
          "mentor-priority-kizuna-inference",
        ],
      ),
    ],
    [CAMPUSFLOW_MENTOR_CONVERSATION_IDS[1]]: [
      founderMessage(
        "history-profile-founder-1",
        "Cho mình biết cụ thể hơn chị Phạm Thu Hà là ai. Các thông tin này lấy từ đâu?",
        "2026-08-02T08:30:00.000Z",
      ),
      assistantMessage(
        "history-profile-assistant-1",
        `Phạm Thu Hà là Senior Product Researcher tại MoMo, có kinh nghiệm về customer discovery, user research và prototype validation.

Hồ sơ mentor hiện ghi nhận chuyên môn chính về customer discovery, prototype testing và problem validation; chị hỗ trợ các team early-stage làm rõ user segment và biến feedback thành insight có thể hành động.

Kizuna phân loại nguồn theo bốn nhóm: Kizuna đã xác minh, nguồn công khai, thông tin do mentor khai báo và phân tích của Kizuna. Nguồn công khai chưa được cấu hình trong bản demo nên không có liên kết ngoài được hiển thị.`,
        "2026-08-02T08:42:00.000Z",
        [
          "mentor-ha-kizuna-profile",
          "mentor-ha-public-profile",
          "mentor-ha-self-declared",
          "mentor-priority-kizuna-inference",
        ],
      ),
    ],
    [CAMPUSFLOW_MENTOR_CONVERSATION_IDS[2]]: [
      founderMessage(
        "history-comparison-founder-1",
        "So sánh anh Quân và chị Hà theo nhu cầu hiện tại của CampusFlow.",
        "2026-08-01T10:00:00.000Z",
      ),
      assistantMessage(
        "history-comparison-assistant-1",
        `Hai mentor phù hợp với hai loại quyết định khác nhau.

Trần Minh Quân phù hợp khi team cần thiết kế pilot, chốt phạm vi và success metric, rồi xác định evidence để quyết định có tiếp tục hay không. Outcome phù hợp là một kế hoạch pilot 14 ngày đủ rõ để bắt đầu.

Phạm Thu Hà phù hợp khi team cần làm rõ nhóm user ưu tiên, đào sâu insight từ prototype testing và kiểm tra feedback hiện tại có phản ánh nhu cầu thật hay chỉ là phản hồi lịch sự. Outcome phù hợp là một user segment ưu tiên và kế hoạch validation tiếp theo.

Với blocker hiện tại, Kizuna đề xuất bắt đầu với anh Quân. Chị Hà phù hợp hơn nếu pilot cho thấy user segment hoặc value proposition chưa đủ rõ.`,
        "2026-08-01T10:16:00.000Z",
        [
          "mentor-quan-kizuna-profile",
          "mentor-ha-kizuna-profile",
          "campusflow-venture-brief",
        ],
      ),
    ],
    [CAMPUSFLOW_MENTOR_CONVERSATION_IDS[3]]: [
      founderMessage(
        "history-preparation-founder-1",
        "Anh Quân đã chấp nhận kết nối. Mình cần chuẩn bị gì cho buổi trao đổi?",
        "2026-07-30T09:30:00.000Z",
      ),
      assistantMessage(
        "history-preparation-assistant-1",
        `Mục tiêu của buổi gặp không nên là trình bày lại toàn bộ CampusFlow. Mentor đã nhận Venture Brief, vấn đề hiện tại và tài liệu được chia sẻ.

Team nên chuẩn bị bốn nhóm nội dung:

1. Mục tiêu cần chốt: kế hoạch pilot 14 ngày với phạm vi, participant group, success metric và evidence rõ ràng.
2. Tài liệu: Venture Brief, Pitch Deck trang 6–11, prototype core flow, tổng hợp 12 interview, ghi chú từ 5 prototype testers và danh sách hai câu lạc bộ quan tâm.
3. Context ba phút đầu: team đã có prototype, năm tester và hai câu lạc bộ quan tâm nhưng chưa chốt phạm vi pilot, cách đo thành công và evidence.
4. Outcome: một câu lạc bộ ưu tiên, phạm vi 14 ngày, một metric chính, danh sách evidence và một owner.`,
        "2026-07-30T09:38:00.000Z",
        [
          "campusflow-venture-brief",
          "campusflow-pitch-pages-6-11",
          "campusflow-interview-summary",
        ],
      ),
      founderMessage(
        "history-preparation-founder-2",
        "Tạo agenda 45 phút giúp mình.",
        "2026-07-30T09:45:00.000Z",
      ),
      assistantMessage(
        "history-preparation-assistant-2",
        `AGENDA ĐỀ XUẤT · 45 PHÚT

0–5 phút · Giới thiệu nhanh team và mục tiêu phiên.
5–12 phút · Trình bày context, prototype và tín hiệu hiện tại.
12–25 phút · Làm rõ phạm vi pilot và nhóm người tham gia.
25–35 phút · Chọn success metric và evidence cần thu thập.
35–42 phút · Xác định owner, deadline và rủi ro.
42–45 phút · Tóm tắt quyết định và bước tiếp theo.`,
        "2026-07-30T09:52:00.000Z",
        ["campusflow-venture-brief", "campusflow-pitch-pages-6-11"],
      ),
    ],
    [CAMPUSFLOW_MENTOR_CONVERSATION_IDS[4]]: [
      founderMessage(
        "history-questions-founder-1",
        "Mình nên hỏi mentor những câu gì để buổi gặp không bị lan man?",
        "2026-07-28T14:00:00.000Z",
      ),
      assistantMessage(
        "history-questions-assistant-1",
        `Không cần hỏi quá nhiều. Team nên tập trung vào những câu buộc buổi gặp tạo ra quyết định cụ thể.

PHẠM VI PILOT
1. Pilot nhỏ nhất đủ để kiểm chứng giá trị là gì?
2. Nên chọn câu lạc bộ có đặc điểm như thế nào?
3. Nhóm người dùng nào cần tham gia trực tiếp?

SUCCESS METRIC
4. Metric nào cho thấy onboarding thực sự được cải thiện?
5. Ngưỡng nào đủ để team tiếp tục đầu tư?
6. Có vanity metric nào team nên tránh?

EVIDENCE
7. Team cần lưu lại evidence nào trong suốt pilot?
8. Feedback định tính nào cần được chuẩn hóa?
9. Cần bao nhiêu người dùng cho một quyết định ban đầu hợp lý?

THỰC THI
10. Ai nên là owner của pilot?
11. Rủi ro nào khiến pilot thất bại nhưng team không học được gì?
12. Nếu kết quả không tốt, team nên quay lại problem, solution hay user segment?

Câu hỏi kết phiên: “Nếu team chỉ thực hiện đúng một việc sau buổi hôm nay, việc nào sẽ giảm bất định nhiều nhất?”`,
        "2026-07-28T14:15:00.000Z",
        ["campusflow-venture-brief", "campusflow-interview-summary"],
      ),
    ],
  };
}
