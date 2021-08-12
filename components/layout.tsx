import Navigation from "./navbar";

export default function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <div className='layout'>
      <Navigation />
      {children}
    </div>
  );
}