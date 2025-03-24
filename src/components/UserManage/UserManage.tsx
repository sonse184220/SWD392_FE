import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { activateAccount, deactivateAccount, getAccountList } from "@/services/adminService";

interface Account {
    userId: string;
    userName: string;
    phoneNumber: string;
    address: string;
    email: string;
    isActive: boolean;
    roleId: number;
    profilePicture: string;
}

const UserManagement: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
    const [confirmActionType, setConfirmActionType] = useState<'activate' | 'deactivate' | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAccountList();
            setAccounts(data.data);
        } catch (error) {
            console.error("Error fetching accounts:", error);
            setError("Failed to load accounts. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const openConfirmDialog = (account: Account, actionType: 'activate' | 'deactivate') => {
        setCurrentAccount(account);
        setConfirmActionType(actionType);
        setIsOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!currentAccount || !confirmActionType) return;

        try {
            if (confirmActionType === 'activate') {
                await activateAccount(currentAccount.userId);
            } else {
                await deactivateAccount(currentAccount.userId);
            }

            // Update local state to reflect the change
            setAccounts(accounts.map(account =>
                account.userId === currentAccount.userId
                    ? { ...account, isActive: confirmActionType === 'activate' }
                    : account
            ));

            setIsOpen(false);
            fetchAccounts(); // Refresh the list to ensure we have the latest data
        } catch (error) {
            console.error(`Error ${confirmActionType}ing account:`, error);
            setError(`Failed to ${confirmActionType} account. Please try again.`);
        }
    };

    const getRoleName = (roleId: number): string => {
        switch (roleId) {
            case 1: return "Admin";
            case 2: return "User";
            case 3: return "Business";
            default: return "Unknown";
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center p-6">Loading accounts...</div>;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
                <Button onClick={fetchAccounts} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            <Table className="w-full border">
                <TableHeader>
                    <TableRow className="bg-gray-200 dark:bg-gray-700">
                        <TableHead className="border px-4 py-2">ID</TableHead>
                        <TableHead className="border px-4 py-2">Username</TableHead>
                        <TableHead className="border px-4 py-2">Email</TableHead>
                        <TableHead className="border px-4 py-2">Phone</TableHead>
                        <TableHead className="border px-4 py-2">Role</TableHead>
                        <TableHead className="border px-4 py-2">Status</TableHead>
                        <TableHead className="border px-4 py-2">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accounts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                                No accounts found
                            </TableCell>
                        </TableRow>
                    ) : (
                        accounts.map((account) => (
                            <TableRow key={account.userId}>
                                <TableCell className="border px-4 py-2">{account.userId}</TableCell>
                                <TableCell className="border px-4 py-2">{account.userName}</TableCell>
                                <TableCell className="border px-4 py-2">{account.email}</TableCell>
                                <TableCell className="border px-4 py-2">{account.phoneNumber}</TableCell>
                                <TableCell className="border px-4 py-2">{getRoleName(account.roleId)}</TableCell>
                                <TableCell className="border px-4 py-2">
                                    <Badge
                                        className={account.isActive
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-red-500 hover:bg-red-600"
                                        }
                                    >
                                        {account.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="border px-4 py-2">
                                    {account.isActive ? (
                                        <Button
                                            variant="destructive"
                                            onClick={() => openConfirmDialog(account, 'deactivate')}
                                        >
                                            Deactivate
                                        </Button>
                                    ) : (
                                        <Button
                                            className="bg-green-500 hover:bg-green-600"
                                            onClick={() => openConfirmDialog(account, 'activate')}
                                        >
                                            Activate
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {confirmActionType === 'activate' ? 'Activate' : 'Deactivate'} Account
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        Are you sure you want to {confirmActionType} the account for <span className="font-bold">{currentAccount?.userName}</span>?
                    </div>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmAction}
                            className={confirmActionType === 'activate'
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-red-500 hover:bg-red-600"
                            }
                        >
                            {confirmActionType === 'activate' ? 'Activate' : 'Deactivate'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagement;