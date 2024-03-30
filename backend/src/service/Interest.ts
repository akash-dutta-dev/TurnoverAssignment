import { User } from "../model/User";
import dataSource from "../config/dataSource";

export const getUserSelectedInterests = async (userId: number): Promise<number[]> => {
  try {
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOneOrFail({
        where: { id: userId},
        relations: ['interests'],
      })

    if (user) {
      // Extract selected interest IDs from the user's interests array
      const selectedInterestIds = user.interests.map((interest) => interest.id);
      return selectedInterestIds;
    } else {
      // User not found or has no interests selected
      return [];
    }
  } catch (error) {
    console.error("Error fetching user's selected interests:", error);
    throw new Error("Failed to fetch user's selected interests");
  }
};
