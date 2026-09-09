public class Ranking
{
    public int Id {get;set;}
    public int Score {get;set;}
    public IEnumerable<Media> MediaList { get; set; }
    public Ranking(IEnumerable<Media> media)
    {
        MediaList = media;
    }
}