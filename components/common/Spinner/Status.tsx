const Status = ({
  status,
  label = status ? 'Active' : 'Inactive'
}: {
  status: boolean
  label?: string
}) => {
  return (
    <span
      className={`relative inline-flex size-4 flex-shrink-0 items-center justify-center rounded-full ${
        status ? 'bg-positive/20' : 'bg-destructive/20'
      }`}
      role="status"
      aria-label={label}
      title={label}
    >
      <span
        className={`absolute size-2 rounded-full ${
          status ? 'bg-positive' : 'bg-destructive'
        }`}
      />
    </span>
  )
}

export default Status
