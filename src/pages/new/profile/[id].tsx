"use client";

import { useRouter } from "next/router";
import LoadingSpinner from "@/components/loading";
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function PlayerPage() {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== "string") return null;

  return (
    <div className="container flex h-full flex-col items-center gap-8 px-4 py-4 ">
      <JoinTeamByInviteLink id={id} />
    </div>
  );
}

const RequestStatuses = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
} as const;

type RequestStatus = (typeof RequestStatuses)[keyof typeof RequestStatuses];

function JoinTeamByInviteLink({ id }: { id: string }) {
  const [sentRequest, setSentRequest] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>(
    RequestStatuses.PENDING,
  );
  const { data, isLoading } = api.team.findById.useQuery({
    id,
  });
  const joinTeamMutation = api.team.join.useMutation({
    onSuccess: async () => {
      toast({
        title: "Success",
        description: "Welcome, your are part of the team!",
        variant: "default",
      });
      setRequestStatus(RequestStatuses.SUCCESS);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      console.log(errorMessage);
      setRequestStatus(RequestStatuses.ERROR);
      toast({
        title: "Error",
        description:
          errorMessage?.title ??
          errorMessage?.description ??
          "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!sentRequest) {
      joinTeamMutation.mutate({ id });
      setSentRequest(true);
    }
  }, [id, joinTeamMutation, sentRequest]);

  if (!data || isLoading) return <LoadingSpinner />;

  return (
    <>
      {requestStatus === RequestStatuses.PENDING && (
        <>
          <h1 className="max-w-sm text-3xl">
            Joining team: <b className="text-primary">{data.team.name}</b>
          </h1>
          <h2 className=" text-md max-w-sm">
            Please hang on while we process your request to join the most
            amazing team on this plattform
          </h2>
          <LoadingSpinner size={1000} />
        </>
      )}
      {requestStatus === RequestStatuses.SUCCESS && (
        <>
          <h1 className="max-w-sm text-3xl">
            Joined team: <b className="text-primary">{data.team.name}</b>
          </h1>
          <h2 className=" text-md max-w-sm">
            You have successfully joined the team. Welcome to the team!
          </h2>
        </>
      )}
      {requestStatus === RequestStatuses.ERROR && (
        <>
          <h1 className="max-w-sm text-3xl">
            Tried to join team: <b className="text-primary">{data.team.name}</b>
          </h1>
          <h2 className=" text-md max-w-sm">
            This is akward, but it seems like something went wrong. Maybe you
            are already a member of this team?
          </h2>
        </>
      )}
    </>
  );
}
