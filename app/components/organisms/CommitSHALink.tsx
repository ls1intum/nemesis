import Link from "next/link";

interface CommitSHALinkProps {
  commitSHA: string;
}

export function CommitSHALink({ commitSHA }: CommitSHALinkProps) {
  return (
    <p>
      Commit Hash:{" "}
      <Link target="_blank" href={`https://github.com/ls1intum/Artemis/commits/${commitSHA}`}>
        {commitSHA.substring(0, 6)}
      </Link>
    </p>
  );
}
