import { createCampusFlowMentorPayload } from "../demo/campusflow-mentor-recommendations";
import type {
  MentorRecommendationGridPayload,
  MentorRecommendationService,
  MentorRecommendationServiceInput,
} from "../types/mentor-recommendation.types";

export class MockMentorRecommendationService
  implements MentorRecommendationService
{
  async recommend(
    input: MentorRecommendationServiceInput,
  ): Promise<MentorRecommendationGridPayload> {
    return createCampusFlowMentorPayload(input.ventureId);
  }
}
