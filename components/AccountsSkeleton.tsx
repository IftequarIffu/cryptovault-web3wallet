// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";

// export function AccountsSkeleton() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>
//           <Skeleton className="h-6 w-40" />
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="flex items-center space-x-4">
//               <Skeleton className="h-12 w-12 rounded-full" />
//               <div className="space-y-2">
//                 <Skeleton className="h-4 w-[250px]" />
//                 <Skeleton className="h-4 w-[200px]" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const AccountsSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-[200px]" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex flex-col justify-between">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}