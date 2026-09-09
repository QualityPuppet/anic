using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[Controller]")]
public class RankingController : ControllerBase
{
    [HttpGet]
    public Pair GetPair()
    {
        return new Pair(new(), new());
    }
}