"use client";

import Button from "@/components/ui/Button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { FC, useState } from "react";
import toast from "react-hot-toast";

interface pageProps {}

const Page: FC<pageProps> = ({}) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const loginWithGoogle = async () => {
		setIsLoading(true);
		try {
			await signIn("google");
		} catch (error) {
			toast.error("Something went wrong with your log in");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full flex flex-col items-center max-w-md space-y-8">
					<div className="flex flex-col items-center gap-8">
						logo
						<h2 className="mt-6 text-center text-3xl font-extralight tracking-tight text-gray-900">
							Sign in to your account
						</h2>
					</div>

					<Button
						isLoading={isLoading}
						type="button"
						className="max-w-sm mx-auto w-full"
						onClick={loginWithGoogle}
					>
						{isLoading ? null : (
							<Image
								src="/google.svg"
								className="w-4 h-4 mr-2"
								alt="Google Login"
								width={4}
								height={4}
							/>
						)}
						Google
					</Button>
				</div>
			</div>
		</>
	);
};

export default Page;
