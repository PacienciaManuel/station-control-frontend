import TimeAgo from "javascript-time-ago";
import pt from 'javascript-time-ago/locale/pt';

TimeAgo.addDefaultLocale(pt);

class TimeAgoManager {
    private static timeAgo = new TimeAgo('pt-PT');
    
    public get TimeAgo() : TimeAgo {
        return TimeAgoManager.timeAgo;
    }
    
    timeago(date: string | Date): string {
        return TimeAgoManager.timeAgo.format(typeof date === "string" ? new Date(date) : date);
    }
}

const timeAgoManager = new TimeAgoManager();

export default timeAgoManager;