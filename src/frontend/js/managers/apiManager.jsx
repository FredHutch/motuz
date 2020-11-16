/**
 * Returns an array of jobs that are currently in progress and write to `dst`.
 * Returns an empty array if no such jobs exist.
 *
 * @param data: dict{
 *   id: int
 *   dst_cloud_id: int
 *   dst_resource_path: str
 * }
 */
export function getJobsInProgressForDestination(state, data) {
    const {dst_cloud_id, dst_resource_path} = data
    return state.jobs.filter(d => (
        d.progress_state === "PROGRESS" &&
        d.dst_cloud_id === dst_cloud_id &&
        d.dst_resource_path === dst_resource_path
    ))
}
