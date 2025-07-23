import CreatePost from "@/components/CreatePost";
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server"

export default async function Home() {
  const user = await currentUser()
    if(!user) return
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      {/* left component in main div */}
      <div className="lg:col-span-6"> 
        { user ? <CreatePost/> : null}
      </div>

      {/* right component for who to follow */}
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
       <WhoToFollow />
      </div>
    </div>
  );
}
