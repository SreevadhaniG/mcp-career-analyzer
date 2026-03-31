import axios from "axios";

export async function fetchLeetcode(username: string) {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const res = await axios.post("https://leetcode.com/graphql", {
    query,
    variables: { username },
  });

  return res.data.data.matchedUser.submitStats.acSubmissionNum;
}