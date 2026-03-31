import axios from "axios";

export async function fetchGithub(username: string) {
  const res = await axios.get(`https://api.github.com/users/${username}`);

  return {
    publicRepos: res.data.public_repos,
    followers: res.data.followers,
  };
}