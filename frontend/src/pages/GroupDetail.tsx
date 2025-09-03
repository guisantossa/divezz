import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGroup } from '../api/groups';
import { ExpenseList } from '../components/expenses/ExpenseList';
import ExpenseChart from '../components/charts/ExpenseChart';

const GroupDetail: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();

    // Convert groupId to number because getGroup expects a number
    const groupIdNumber = Number(groupId);

    const { data: group, isLoading, error } = useQuery(['group', groupIdNumber], () => getGroup(groupIdNumber));

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading group details</div>;

    if (!group) return <div>No group found</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <div className="mt-4">
                <h2 className="text-xl">Expenses</h2>
                <ExpenseList groupId={groupIdNumber} />
            </div>
            <div className="mt-4">
                <h2 className="text-xl">Expense Overview</h2>
                <ExpenseChart groupId={groupIdNumber} />
            </div>
        </div>
    );
};

export default GroupDetail;
