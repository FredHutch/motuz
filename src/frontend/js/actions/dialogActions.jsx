export const SHOW_COPY_JOB_DIALOG = '@@dialog/SHOW_COPY_JOB_DIALOG';
export const HIDE_COPY_JOB_DIALOG = '@@dialog/HIDE_COPY_JOB_DIALOG';


export const showCopyJobDialog = () => ({
    type: SHOW_COPY_JOB_DIALOG,
});

export const hideCopyJobDialog = () => ({
    type: HIDE_COPY_JOB_DIALOG,
});
