using Microsoft.AspNetCore.SignalR;

namespace WebClases.API.Hubs;

public class AvailabilityHub : Hub
{
    public async Task JoinAvailabilityUpdates()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, "availability");
    }

    public async Task LeaveAvailabilityUpdates()
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "availability");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, "availability");
        await base.OnDisconnectedAsync(exception);
    }
}
