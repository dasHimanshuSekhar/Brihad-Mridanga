'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '../actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Logging in...' : 'Login'}
        </Button>
    )
}

export function LoginForm() {
    const [state, action] = useActionState(login, undefined);

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={action} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="userId">User ID</Label>
                        <Input id="userId" name="userId" placeholder="admin" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" placeholder="password" required />
                    </div>

                    {state?.error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {state.error}
                            </AlertDescription>
                        </Alert>
                    )}

                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    )
}
