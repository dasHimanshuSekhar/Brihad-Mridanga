import { getLeaderboardData } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';

export async function Leaderboard() {
  const leaderboardData = await getLeaderboardData();

  const getTrophyColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-yellow-700';
    return 'text-muted-foreground';
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Top 10 Readers</CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboardData.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>User (Mobile)</TableHead>
                <TableHead className="text-right">Total Books</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((user) => (
                <TableRow key={user.rank}>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className={`w-5 h-5 ${getTrophyColor(user.rank)}`} />
                      <span className="font-bold text-lg">{user.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{user.mobile}</TableCell>
                  <TableCell className="text-right font-bold text-lg text-accent">{user.totalBooks}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center py-8">The leaderboard is still empty. Be the first to make your mark!</p>
        )}
      </CardContent>
    </Card>
  );
}
