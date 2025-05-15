using System.Net.Http;
using System.Threading.Tasks;

public static class TelegramNotifier
{
    private static readonly string BotToken = "7696906146:AAFayIqFPs9KCnp1a0WuNWZuXeS_gm5W8dc"; 
    private static readonly string ChatId = "5717252430"; 

    public static async Task SendMessageAsync(string message)
    {
        using var client = new HttpClient();
        var url = $"https://api.telegram.org/bot{BotToken}/sendMessage?chat_id={ChatId}&text={Uri.EscapeDataString(message)}";
        await client.GetAsync(url);
    }
} 