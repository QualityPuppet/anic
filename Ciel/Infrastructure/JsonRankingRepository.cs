class JsonRankingRepository : IRankingRepository
{
    private List<Ranking> _rankings {get;set;}
    // public JsonRankingRepository() { }

    public Ranking LoadRankings(int listId)
    {
        if (_rankings.Select(r => r.Id).Contains(listId))
        {
            return _rankings.First(r => r.Id == listId);
        }

        var rankings = File.ReadAllText(GetPath(listId));
        var rankingJson = Newtonsoft.Json.JsonConvert.DeserializeObject<Ranking>(rankings);
        
        if (rankingJson == null)
        {
            throw new NullReferenceException($"List {listId} not found.");
        }

        return rankingJson;
    }

    public void SaveRankings(int listId, Ranking rankings)
    {
        var rankingJson = Newtonsoft.Json.JsonConvert.SerializeObject(rankings);
        
        File.WriteAllText(GetPath(listId), rankingJson);

        if (_rankings.Select(r => r.Id).Contains(listId))
        {
            // TODO: stop being lazy
            _rankings.RemoveAll(r => r.Id == listId);
        }
           _rankings.Add(rankings);
    }

    private static string GetPath(int listId)
    {
        var currentDirectory = Directory.GetCurrentDirectory();
        var directoryPath = Path.Combine(currentDirectory, "rankings");
        
        if (!Directory.Exists(directoryPath))
        {
            Directory.CreateDirectory(directoryPath);
        }
        
        return Path.Combine(directoryPath, string.Concat(listId.ToString(), ".json"));
    }
}