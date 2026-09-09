public interface IRankingRepository
{
    void SaveRankings(int listId, Ranking rankings);
    Ranking LoadRankings(int listId);
}