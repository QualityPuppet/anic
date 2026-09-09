using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[Controller]")]
public class RepositoryController : ControllerBase
{
    private IRankingRepository _rankingRepository {get;set;}
    public RepositoryController(IRankingRepository rankingRepository)
    {
        _rankingRepository = rankingRepository;
    }

    [HttpPost("Save")]
    public void SaveRankings([FromBody] List<Media> media)
    {
        var rankings = new Ranking(media);
        _rankingRepository.SaveRankings(1, rankings);
    }

    [HttpGet("Load/{id:int}")]
    public Ranking LoadRankings(int id)
    {
        return _rankingRepository.LoadRankings(id);
    }
}