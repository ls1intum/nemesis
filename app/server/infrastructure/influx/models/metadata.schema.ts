import {MetadataDAO} from "@server/domain/dao/metadata";
import {z} from "zod";

export const validateMetadataSchema = (data: unknown): MetadataDAO | null => {
    const parsed = MetadataSchema.safeParse(data);
    if (!parsed.success) {
        return null;
    }

    let newestMetadata = null;
    parsed.data.forEach((row) => {
        newestMetadata = {
            commitSHA: row.commit_sha,
            commitDate: new Date(row._time),
        };
    });

    return newestMetadata;
}

const MetadataSchema = z.array(z.object({
    commit_sha: z.string(),
    _time: z.string(),
}))
