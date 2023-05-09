type Props = {
  hasNav?: boolean
  children?: React.ReactNode
}

const Container = ({ children, hasNav }: Props) => {
  return <div className="container mx-auto px-5" style={{ paddingTop: hasNav ? '48px' : 'auto' }}>{children}</div>
}

export default Container
