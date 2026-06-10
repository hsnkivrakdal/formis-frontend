"use client";
import type { LayoutKey, StudentProfile } from "@/types/petition";
import { GeneralLayout } from "./layouts/General";
import { CancellationLayout } from "./layouts/Cancellation";
import { EkSinav44cLayout } from "./layouts/EkSinav44c";
import { MazeretSinaviFinalLayout } from "./layouts/MazeretSinaviFinal";
import { IlisikKesmeLayout } from "./layouts/IlisikKesme";

interface Props {
  layoutKey: LayoutKey;
  profile: StudentProfile;
  initialDate: string;
  code: string;
  formTypeId: number;
  semesterId: number;
  precursorId: number;
  formStatusId: number;
}

export function PetitionEditor(props: Props) {
  const { layoutKey } = props;
  switch (layoutKey) {
    case "general":
      return <GeneralLayout {...props} />;
    case "cancellation":
      return <CancellationLayout {...props} />;
    case "ek-sinav-44c":
      return <EkSinav44cLayout {...props} />;
    case "mazeret-sinavi-final":
      return <MazeretSinaviFinalLayout {...props} />;
    case "ilisik-kesme":
      return <IlisikKesmeLayout {...props} />;
  }
}
