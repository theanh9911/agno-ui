import { FC } from 'react'
import CopyButton from '../CopyButton'

interface CommandPart {
  text: string
  type: 'command' | 'subcommand' | 'argument' | 'flag'
}

interface TerminalCommandProps {
  command: CommandPart[]
}

const TerminalCommand: FC<TerminalCommandProps> = ({ command }) => {
  const getColorClass = (type: string) => {
    switch (type) {
      case 'command':
        return 'text-positive'
      case 'subcommand':
        return 'text-[rgba(250,250,250,0.50)]'
      case 'argument':
      case 'flag':
        return 'text-[#FAFAFA]'
      default:
        return 'text-[#FAFAFA]'
    }
  }

  const renderStyledCommand = () => {
    return command.map((part, index) => (
      <span key={index} className={getColorClass(part.type)}>
        {part.text}
        {index < command.length - 1 ? ' ' : ''}
      </span>
    ))
  }

  const getCommandString = () => {
    return command.map((part) => part.text).join(' ')
  }

  return (
    <div className="flex w-full justify-between rounded-sm bg-[#111113] p-4">
      <span className="font-mono text-lg font-medium leading-[120%] tracking-[-0.18px]">
        {renderStyledCommand()}
      </span>
      <CopyButton
        content={getCommandString()}
        className="text-white"
        size="xs"
      />
    </div>
  )
}

export default TerminalCommand
