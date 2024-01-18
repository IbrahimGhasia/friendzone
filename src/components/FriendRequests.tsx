"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { CheckIcon, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface FriendRequestsProps {
	incomingFriendRequests: IncomingFriendRequest[];
	sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
	incomingFriendRequests,
	sessionId,
}) => {
	const router = useRouter();
	const [friendRequest, setFriendRequest] = useState<IncomingFriendRequest[]>(
		incomingFriendRequests
	);

	useEffect(() => {
		pusherClient.subscribe(
			toPusherKey(`user:${sessionId}:incoming_friend_requests`)
		);

		const friendRequestHandler = ({
			senderId,
			senderEmail,
		}: IncomingFriendRequest) => {
			setFriendRequest((prev) => [...prev, { senderId, senderEmail }]);
		};

		pusherClient.bind("incoming_friend_requests", friendRequestHandler);

		return () => {
			pusherClient.unsubscribe(
				toPusherKey(`user:${sessionId}:incoming_friend_requests`)
			);
			pusherClient.unbind(
				"incoming_friend_requests",
				friendRequestHandler
			);
		};
	}, []);

	const acceptFriend = async (senderId: string) => {
		await axios.post("/api/friends/accept", { id: senderId });

		setFriendRequest((prev) =>
			prev.filter((request) => request.senderId !== senderId)
		);

		router.refresh();
	};

	const denyFriend = async (senderId: string) => {
		await axios.post("/api/friends/deny", { id: senderId });

		setFriendRequest((prev) =>
			prev.filter((request) => request.senderId !== senderId)
		);

		router.refresh();
	};

	return (
		<>
			{friendRequest.length === 0 ? (
				<p className="text-sm text-zinc-500">Nothing to show here...</p>
			) : (
				friendRequest.map((request) => (
					<div
						key={request.senderId}
						className="flex gap-4 items-center"
					>
						<UserPlus className="text-black" />
						<p className="font-medium text-lg">
							{request.senderEmail}
						</p>
						<button
							aria-label="accept friend"
							className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md"
							onClick={() => acceptFriend(request.senderId)}
						>
							<CheckIcon className="font-semibold text-white w-3/4 h-3/4" />
						</button>

						<button
							aria-label="deny friend"
							className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
							onClick={() => denyFriend(request.senderId)}
						>
							<X className="font-semibold text-white w-3/4 h-3/4" />
						</button>
					</div>
				))
			)}
		</>
	);
};

export default FriendRequests;
