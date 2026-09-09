public class Pair
{
    public Media Current {get;set;}
    public Media Compare {get;set;}
    public Pair(Media current, Media compare)
    {
        Current = current;
        Compare = compare;
    }
}