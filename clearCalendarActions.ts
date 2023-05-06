import { GRAPH_BEARER_TOKEN } from "./constants";

export class ClearCalendarActions {
  public async getCalendarEvents(date): Promise<any> {
    function convertToIso8601(dateString) {
      const date = new Date(dateString.replace(/(\d+)(st|nd|rd|th)/, "$1"));

      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const day = String(date.getUTCDate()).padStart(2, "0");
      const isoDate = `${year}-${month}-${day}T00:00:00.000Z`;

      return isoDate;
    }
    const startTime = convertToIso8601(date);
    const newTime = "23:59:00.000Z";
    const endTime = startTime.replace(
      /T\d\d:\d\d:\d\d.\d\d\dZ$/,
      `T${newTime}`
    );

    const apiUrl = `https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=${startTime}&enddatetime=${endTime}`;

    const response = fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${GRAPH_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    const finalResponse = await response;
    return finalResponse.json();
  }
  public async cancelMeetings(response): Promise<boolean> {
    function getOrganizerIdsFromJson(json) {
      const ids = [];
      const valueArray = json.value || [];
      for (const item of valueArray) {
        if (item.isOrganizer) {
          ids.push(item.id);
        }
      }
      return ids;
    }
    // Filter Meetings Organized by User to Cancel Meetings
    const ids = getOrganizerIdsFromJson(response);

    async function cancelEvents(ids, token) {
      let allSucceeded = true;
      for (const id of ids) {
        try {
          const response = await fetch(
            `https://graph.microsoft.com/v1.0/me/events/${id}/cancel`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            allSucceeded = false;
            console.error(
              `Failed to cancel event with id ${id}: ${response.statusText}`
            );
          }
        } catch (error) {
          allSucceeded = false;
          console.error(
            `Failed to cancel event with id ${id}: ${error.message}`
          );
        }
      }
      return allSucceeded;
    }
    return cancelEvents(ids, GRAPH_BEARER_TOKEN);
  }
}
