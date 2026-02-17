import { useState } from "react";

// ═══════════════════════════════════════════════════════════
// V3 DATA MODELS — Refined from 15 real manual analysis
// ═══════════════════════════════════════════════════════════

const DOOR_MODELS = [
  { id:"pivot_bookcase", label:"Pivot-Hinge Bookcase", hanging:"pivot_drop", warpMethod:"bolt", stopArm:true, closerDefault:"gravity", bearing:true },
  { id:"mf_panel", label:"Panel Door (Manfred Frank)", hanging:"rock_block", warpMethod:"none", stopArm:false, closerDefault:"gas_spring", bearing:false },
  { id:"mf_mirror", label:"Mirror Door (Manfred Frank)", hanging:"rock_block", warpMethod:"none", stopArm:false, closerDefault:"gas_spring", bearing:false },
  { id:"vault", label:"Vault Door (Manfred Frank)", hanging:"rock_block", warpMethod:"none", stopArm:false, closerDefault:"gas_spring", bearing:false, lockingPins:true },
  { id:"vault_metal", label:"Heavy Metal Vault (Shaft Insert)", hanging:"vertical_shaft", warpMethod:"torsion_bar", stopArm:false, closerDefault:"slide_track", bearing:true },
  { id:"sliding_bookcase", label:"Sliding Bookcase (Bi-Parting)", hanging:"sliding", warpMethod:"none", stopArm:false, closerDefault:"none", bearing:false },
];

const HANGING_PROTOCOLS = {
  pivot_drop: { label:"Protocol A: Pivot Drop", desc:"Top/bottom shafts with tapered roller bearings" },
  rock_block: { label:"Protocol B: Rock & Block", desc:"Manfred Frank concealed hinges (2 hinges, 2 screws each)" },
  vertical_shaft: { label:"Protocol C: Vertical Shaft Insert", desc:"Heavy metal vault — too heavy to tilt" },
  sliding: { label:"Protocol D: Sliding Mechanism", desc:"Wall-mounted rail with carriage bolts" },
};

const FRAME_DEPTHS = [
  { id:"inset_flush", label:"Inset — Flush w/ Drywall" },
  { id:"inset_behind", label:"Inset — Behind Finish Material" },
  { id:"offset_proud", label:"Offset / Proud — Cabinets Behind" },
];

const WALL_SUBSTRATES = [
  { id:"wood", label:"Wood Studs", screws:'supplied 3" fasteners', note:"" },
  { id:"steel", label:"Steel Studs", screws:'self-tapping #12×3"', note:"Use toggle bolts where possible." },
  { id:"masonry", label:"Masonry / Concrete", screws:'supplied fasteners', note:"" },
  { id:"mixed", label:"Mixed Substrate", screws:"supplied fasteners", note:"Identify substrate at each hole." },
];

const INGRESS_METHODS = [
  { id:"egress_btn", label:"Egress Button", wire:"EGRESS", always:true, methodDesc:"An Egress Button for activating the door from the inside. It is to be mounted in the location of your choice." },
  { id:"book_tilt", label:"Book / Bottle Tilt Switch", wire:null, methodDesc:"A Custom Tilt Switch inside a bottle for activating the door from the outside. The battery has been removed for shipping and must be inserted into the tilt switch for it to function. It is recommended that this always remain outside the secret room as to prevent it from being left inside your secret room and leaving you without a way to enter into your secret area. It is recommended that you test your switch before locking the door and being outside of your secret room, in the same manner as the Egress button was tested." },
  { id:"wireless_keypad", label:"Wireless Keypad", wire:null, methodDesc:"A Wireless Keypad for activating the door from the outside. Default code: 2-4-6-8-*. Reprogram per included instructions." },
  { id:"key_fob", label:"Wireless Key Fob", wire:null, methodDesc:"A Wireless Key Fob for activating the door. Keep outside secret room. Test before relying on it." },
  { id:"rfid", label:"RFID Scanner", wire:"RFID", methodDesc:"An RFID Scanner for activating the door. Mount at remote location. Keycards pre-programmed." },
  { id:"wired_keypad", label:"Wired Keypad", wire:"KEYPAD", methodDesc:"A Wired Keypad for activating the door." },
  { id:"pin_sequence", label:"Pin / Switch Sequence", wire:null, methodDesc:"A Pin button for activating the door from the outside." },
  { id:"home_auto", label:"Home Automation (3rd Party)", wire:null, methodDesc:"Home automation integration for activating the door remotely." },
  { id:"manual_release", label:"Manual Emergency Release", wire:null, methodDesc:"Handle on back of door for emergency exit (vault systems)." },
  { id:"sconce", label:"Wireless Sconce Transmitter", wire:null, methodDesc:"There will be a Sconce that will be sent later that has a wireless transmitter in it. This switch will open the door when activated." },
];

const WIRE_LABELS = [
  { id:"maglock", label:"MAGLOCK", defaultDesc:"This is to be connected to the corresponding wire coming from the Frame that is also labeled MAGLOCK." },
  { id:"maglocks", label:"MAGLOCKS", defaultDesc:"This is to be connected to the corresponding wire coming from the Frame that is also labeled MAGLOCKS." },
  { id:"egress", label:"EGRESS", defaultDesc:"This is to be connected to the supplied exit button that is to be mounted on the wall at the location of your choice." },
  { id:"ingress", label:"INGRESS", defaultDesc:"This is to be connected to the corresponding wire coming from the Frame that is also labeled INGRESS." },
  { id:"switch_inputs", label:"SWITCH INPUTS", defaultDesc:"This is to be connected to the corresponding wire coming from the Frame that is also labeled SWITCH INPUTS." },
  { id:"actuator", label:"ACTUATOR", defaultDesc:"This is to be connected to the corresponding wire coming from the Frame that is also labeled ACTUATOR." },
  { id:"motor_power", label:"MOTOR POWER", defaultDesc:"This is to be connected to the corresponding wire coming from the Frame that is also labeled MOTOR POWER." },
  { id:"motor_control", label:"MOTOR CONTROL", defaultDesc:"This is to be connected to the corresponding wire coming from the Frame that is also labeled MOTOR CONTROL." },
  { id:"lights", label:"LIGHTS", defaultDesc:"This is to be connected to the corresponding wire coming from the Frame that is also labeled LIGHTS." },
  { id:"power_door_b", label:"POWER TO DOOR B", defaultDesc:"This is to be connected to the corresponding wire coming from the Frame that is also labeled POWER TO DOOR B." },
  { id:"rfid_wire", label:"RFID", defaultDesc:"This is to be connected to the RFID scanner mounted at the location of your choice." },
  { id:"keypad_wire", label:"KEYPAD", defaultDesc:"This is to be connected to the wired keypad mounted at the location of your choice." },
  { id:"third_party", label:"3RD PARTY CONTROL", defaultDesc:"This is to be connected to the home control systems panel into a Normally Closed relay." },
];

const SWING_TYPES = [
  { id:"inswing", label:"Inswing (into secret room)" },
  { id:"outswing", label:"Outswing (away from secret room)" },
];

const DOOR_CONFIGS = [
  { id:"single", label:"Single Door" },
  { id:"double_shared", label:"Double Door — Shared Frame", desc:"Two doors in one frame with center cabinet (e.g., Christy Hill, Kalivas)" },
  { id:"double_separate", label:"Double Door — Separate Frames", desc:"Two independent door systems, each with own frame (gets 2 manuals)" },
];

const CABINET_CONFIGS = [
  { id:"none", label:"None (standalone)" },
  { id:"flanking", label:"Flanking Cabinets" },
  { id:"dual_door", label:"Dual-Door + Center Cabinet" },
];

const CLADDING_OPTIONS = [
  { id:"shelves_books", label:"Shelves & Books" },
  { id:"slatwall", label:"Slatwall / Panels" },
  { id:"stone", label:"Stone Veneer" },
  { id:"mirror_rail", label:"Mirror (slotted rail)" },
  { id:"french_cleat", label:"French Cleat Mirror" },
  { id:"metal_vent", label:"Metal Vent (magnets)" },
  { id:"wall_molding", label:"Wall Molding Pattern" },
  { id:"custom_panel", label:"Custom Panel / Skin" },
];

const AUTO_CLOSERS = [
  { id:"gravity", label:"Gravity (shelf-load)" },
  { id:"gas_spring", label:"Gas Spring" },
  { id:"arm_track", label:"Arm-and-Track" },
  { id:"slide_track", label:"Slide-Track (vault)" },
  { id:"none", label:"None" },
];

const WARP_METHODS = [
  { id:"bolt", label:'Standard Warp Bolt (9/16")' },
  { id:"cam_lock", label:"Cam Lock (top nut)" },
  { id:"torsion_bar", label:"Torsion Bar (access plate)" },
  { id:"none", label:"None / N/A" },
];

const POST_HANG_OPTIONS = [
  { id:"wire_conduit", label:"Flexible Wire Conduit" },
  { id:"cable_chain", label:"Cable Chain (snap link)" },
  { id:"wago_connectors", label:"WAGO Connectors" },
];

// ═══════════════════════════════════════════════════════════
// MANUAL GENERATION — Matched to real CHE manual patterns
// ═══════════════════════════════════════════════════════════

function generateManualData(f) {
  const model = DOOR_MODELS.find(m=>m.id===f.doorModel) || DOOR_MODELS[0];
  const sub = WALL_SUBSTRATES.find(s=>s.id===f.wallSubstrate) || WALL_SUBSTRATES[0];
  const wt = parseInt(f.doorWeight) || 350;
  const isOff = f.frameDepth === "offset_proud";
  const hasCab = f.cabinetConfig !== "none";
  const isDualCab = f.cabinetConfig === "dual_door";
  const doorConfig = f.doorConfig || "single";
  const isDual = doorConfig === "double_shared";
  const isDoubleSep = doorConfig === "double_separate";
  const swingType = f.swingType || "inswing";
  const hasMotor = (f.selectedWires||[]).includes("motor_power");
  const closerId = f.autoCloser || model.closerDefault;
  const warpId = f.warpMethod || model.warpMethod;
  const postHang = f.postHangOptions || [];
  const clad = f.claddingOptions || [];

  // Dual-door shared-frame uses "Right Side" / "Left Side" instead of "Hinge Side" / "Non-Hinge Side"
  const firstSide = isDual ? (f.dualFirstSide || "right") : "hinge";
  const firstSideLabel = isDual ? (firstSide === "right" ? "Right Side" : "Left Side") : "Hinge Side";
  const secondSideLabel = isDual ? (firstSide === "right" ? "Left Side" : "Right Side") : "Non-Hinge Side";

  // Plural language for dual doors
  const doorWord = isDual ? "doors" : "door";
  const maglockPlural = isDual ? "electromagnetic locks have a visible red LED" : "electromagnetic lock has a visible red LED";
  const maglockPlural2 = isDual ? "Maglocks are turning green" : "Maglock is turning green";

  // Build selected wires list with descriptions
  const selectedWires = (f.selectedWires || []).map(id => {
    const w = WIRE_LABELS.find(x=>x.id===id);
    return w ? { label: w.label, desc: (f.wireDescs && f.wireDescs[id]) || w.defaultDesc } : null;
  }).filter(Boolean);

  const doc = [];
  let stepNum = 0;
  const step = () => ++stepNum;

  // ── TITLE PAGE (for double-separate, indicate which door) ──
  if (isDoubleSep) {
    doc.push({type:"plain", text:`Door ${f.doorNumber || 1} of 2\n${f.doorSideLabel || (f.swingDirection === "left" ? "Left Door" : "Right Door")}`});
  }

  // ── PREAMBLE ──
  doc.push({type:"preamble", text:`Thank you for installing this new secret passageway door system from Creative Home Engineering. The installation is fairly straight forward, but you should know a few things that can make it easier. We strongly recommend that you carefully read through and understand the entire instructions before beginning the installation.`});
  doc.push({type:"center_warning", text:"BEFORE MOVING FORWARD PLEASE BE CERTAIN THAT THE ROUGH OPENING WHICH INCLUDE SIDES AND THE HEADER, BE PERFECTLY PLUMB AND LEVEL. IF IT IS NOT, PLEASE CORRECT BEFORE PROCEEDING."});

  // ── 1. UNLOADING ──
  const s1 = step();
  doc.push({type:"heading", text:`${s1}. UNLOADING:`});
  if (wt >= 300) {
    doc.push({type:"bold_warning", text:"*CAUTION, THESE CRATES ARE EXTREMEY HEAVY AND EXTRA PRECAUTIONS SHOULD BE EXERCISED BEFORE MOVING*"});
  }
  doc.push({type:"plain", text:`Use a fork lift with long forks to remove the crates from the delivery truck. Alternatively, a lift gate truck can be used by swinging the end of the crate off the truck and supporting one end with the lift gate and the other end with three or four people. Then the lift gate and people should lower the crate to the ground in unison. Inspect the crate for signs of damage and contact Creative Home Engineering immediately if damaged. Locate the shock-watch and tip-n-tell indicators and confirm that they have not been activated, but do not reject the shipment based on those indicators alone. If damage is visible be sure to keep all crate materials. Once the crate is safely on the ground it can be dismantled from the top down, and all pieces of the secret passage can carefully be moved to the installation location.`});
  if (model.hanging !== "sliding") {
    doc.push({type:"plain", text:`When removing the door from the crate you will notice there are two lifting points on the top end for threaded eyelets if a lifting device is available. Otherwise, you will need a sturdy cart or multiple people to lift and carry the door and frame to the installation area.`});
  }
  if (model.id === "mf_mirror") {
    doc.push({type:"bold_warning", text:"DO NOT LIFT THE MIRROR DOOR OUT OF THE CRATE BY GRABBING THE MIRROR. IT IS MARKED ON THE PLASTIC WRAPPING WHERE NOT TO GRAB."});
  }

  // ── 2. VERIFY CONDITIONS ──
  const s2 = step();
  doc.push({type:"heading", text:`${s2}. VERIFY EXISTING CONDITIONS:`});
  doc.push({type:"plain", text:`It is absolutely critical that the ground on which the door sits is level. If the floor is out of level, or not flat, correct it with shims and level your secret passageway separate from the flooring before attempting to install the secret passage. It is also critical that the studs that comprise the rough opening be plumb. Compare the existing opening to the required specifications (found on the final pages of the "Client Approval Drawing") to ensure that they match. Correct any variances before proceeding. The time taken on this step of the process will make the installation of the secret passageway much easier. The importance of correct wall conditions and level flooring cannot be overstated.`});

  // ── 3. INSTALLATION PREPARATION ──
  const s3 = step();
  doc.push({type:"heading", text:`${s3}. INSTALLATION PREPARATION:`});
  doc.push({type:"plain", text:`Confirm that there are studs around the wall opening where the secret passageway will be mounted${sub.id !== "wood" ? " (if the material is not wood appropriate fasteners will need to be acquired)" : ""}. These studs will be used to mount your secret passageway.${f.includeYouTube ? ` We recommend you watch our installation video on YouTube about installing your secret passageway to avoid some common yet major installation issues. Simply search "Before You Install Your Secret Door" on YouTube.com or use the following link: https://youtu.be/DD86W0uhlEE` : ""}`});
  doc.push({type:"red_note", text:`*Directional instructions are given as if the person was standing outside of the secret room looking in*`});

  if (f.electricalNotes) {
    doc.push({type:"red_note", text:f.electricalNotes});
  }

  // ═══════════════════════════════════════════════════════
  // DUAL-DOOR SHARED FRAME FLOW (Christy Hill / Kalivas)
  // ═══════════════════════════════════════════════════════
  if (isDual) {
    // Step 4: Install first side of frame
    const s4 = step();
    doc.push({type:"heading", text:`${s4}. INSTALL THE ${firstSideLabel.toUpperCase()} OF THE DOOR FRAME:`});
    doc.push({type:"plain", text:`This secret passage comes in multiple pieces. The frame and stationary sections will need to be installed before the doors can be hung. Carefully carry the Frame to the rough opening and fit the Frame into position inside the Rough Opening.`});
    if (isOff) {
      doc.push({type:"plain", text:"Be sure to run the 110VAC pigtail into the hole in the top of the frame."});
      doc.push({type:"red_note", text:"*For safety, please keep hands on the frame at this time, even if it is in a rested position*"});
    }
    doc.push({type:"plain", text:`The door frame should be shimmed independently of the wall during the mounting process to hold the frame level and plumb both left-to-right and front-to-back.`});
    doc.push({type:"red_note", text:`*This will greatly influence how well your secret passageway operates, the recommended tolerance is limited to a 16th of an inch or less if possible*`});
    doc.push({type:"plain", text:`You will need to secure the frame with the ${sub.screws}. At this time, you will only be securing the ${firstSideLabel} of the Frame.`});
    doc.push({type:"red_note", text:`*Before driving each screw, verify that the vertical sides of the door frame are still perfectly plumb, both side-to-side and front-to-back. Otherwise, the door will be a parallelogram, causing rubbing on the bottom of the frame, and requiring touch up work. The importance of leveling your secret passageway cannot be overstated. You MUST use a laser level. A bubble level is not accurate enough due to the height of your secret passageway and will cause issues during all steps of the installation process.*`});
    doc.push({type:"plain", text:`After checking in all directions, pre-drill and secure the ${firstSideLabel} of the frame with a single screw in the upper-most hole. Continue checking to confirm that the Door Frame is in the correct, plumb position as you pre-drill and secure all remaining screws into the countersunk holes on the ${firstSideLabel} of the frame.`});

    if (isOff) {
      doc.push({type:"plain", text:`The back side of the pilasters should be 14" from the face of the drywall as shown below. This spacing is important for a future step to allow the stationary cabinetry to tuck behind these pilasters.`});
    }

    // Step 5: Install stationary sections
    const s5 = step();
    doc.push({type:"heading", text:`${s5}. INSTALL THE STATIONARY SECTIONS:`});
    doc.push({type:"plain", text:`To finish securing the Door Frame, the two stationary sections must be mounted as well. The two stationary sections are identical. They can be carried into place next to the partly mounted frame.`});

    // Step 6: Connect other side of frame
    const s6 = step();
    doc.push({type:"heading", text:`${s6}. CONNECT THE ${secondSideLabel.toUpperCase()} OF THE FRAME:`});
    doc.push({type:"plain", text:`The stationary cabinet to the ${secondSideLabel.toLowerCase().replace(" side","")} of the frame should be pushed right next to the frame and attached using 1 1/4" long flat head screws. This side of the frame needs to be plumb both left to right and front to back.`});
    doc.push({type:"plain", text:`With the ${secondSideLabel.toLowerCase()} of the frame secured to the stationary cabinet, both stationary cabinets can be attached using the Pilasters. These pilasters should fit between the stationary cabinets and the wall.`});
    doc.push({type:"plain", text:`The 1 1/4" Flat head screws can be used to attach the pilaster to the cabinets. With the pilasters attached everything can be secured to the walls. Everything should be plumb and level both front to back and left to right.`});
    doc.push({type:"plain", text:`The Frame should have screws put through the top of the frame into the header of the rough opening.`});

    // Step 7: Hang left door
    const sHangL = step();
    doc.push({type:"heading", text:`${sHangL}. INSTALL THE LEFT DOOR:`});
    if (model.hanging === "pivot_drop") {
      doc.push({type:"plain", text:`The Wooden Door can be lifted by two people and easily hung with assistance from a third to set the threaded shafts into their corresponding bearings. In the pivot sets on the Door Frame there needs to be both bearings before hanging the door. The top pivot set should have a bearing already secured, while the bottom pivot set has a tapered roller bearing seat that is secured in place but will need the corresponding tapered roller bearing to be set inside.`});
      doc.push({type:"plain", text:`The Door has a top and bottom shaft by which it hangs. The bottom threaded shaft has been set in shop to the correct door height with a Jam Nut. Do not loosen the bottom shaft.`});
      doc.push({type:"plain", text:`To hang the door, you will need to tilt the back of the door backwards at a slight angle so that the top of the door can slip under the frame. (We recommend putting down a protective material like ram board to help protect the threshold while hanging the doors).`});
      doc.push({type:"plain", text:`Have a person on either end of the door and one in the middle hold onto the shelf. The people at the end use a second hand to support the back side of the door as you move it around. Have someone guide the bottom threaded shaft into the bottom bearing. Once the bottom bearing is set in place the door can be tilted back up right.`});
      doc.push({type:"plain", text:`Supplied is a 1" diameter keyed shaft about 3.5" long. Insert this shaft through the top of the door with the key in the correct orientation so that is goes into the flange collar on top of the door. Keep pushing until the end of the keyed shaft is completely seated in the top bearing. Once seated, you can tighten the 2 screws on the flange collar on top of the door with a 3/16 allen wrench. (if you have a mini ratchet with a 3/16" allen bit that is very useful as well).`});
      doc.push({type:"plain", text:`Once the top shaft is in its final position and the flange collar is tightened check that the door closes without any collisions.`});
    }

    // Step 8: Hang right door
    const sHangR = step();
    doc.push({type:"heading", text:`${sHangR}. INSTALL THE RIGHT DOOR:`});
    doc.push({type:"plain", text:`The right door will hang the same way the left door did.`});

  // ═══════════════════════════════════════════════════════
  // SINGLE DOOR FLOW (and double-separate)
  // ═══════════════════════════════════════════════════════
  } else {
    // ── 4. FRAME INSTALLATION (HINGE SIDE) ──
    const s4 = step();
    if (model.hanging === "pivot_drop" && isOff && hasCab) {
      doc.push({type:"heading", text:`${s4}. MOVE THE FRAME INTO THE ROUGH OPENING:`});
    } else {
      doc.push({type:"heading", text:`${s4}. INSTALL THE HINGE SIDE OF THE DOOR FRAME:`});
    }

    if (model.hanging === "pivot_drop" && !isOff && !hasCab) {
      doc.push({type:"plain", text:`This secret passage comes pre-hung as a door system that will install almost the same as an ordinary door and door frame would. Carefully carry this door to the rough opening.${swingType === "inswing" ? " Do not remove any of the cling wrap from the door as it is helping to hold the door closed." : ""} Fit the Door and Frame into position inside the Rough Opening.`});
    } else if (model.hanging === "pivot_drop" && isOff && hasCab) {
      doc.push({type:"plain", text:`This secret passage comes pre-hung as a door system that will install almost the same as an ordinary door and door frame would. Carefully carry this door to the rough opening. Do not remove any of the cling wrap from the door as it is helping to hold the door closed. Fit the Door and Frame into position inside the Rough Opening with a person in the secret room.`});
      doc.push({type:"plain", text:`The wrap can be carefully removed and the door opened. Note: the door has foam block stuffed in between the door and the frame that will prevent the door from being able to open. Remove these from the sides and the top but not from the floor yet as the foam under the door is currently supporting the weight of the door.`});
      doc.push({type:"plain", text:`Lift the door from the non-hinge side to the 90-degree open position and rest the door on some foam or other soft material so the door remains level. Be sure to run the 110VAC pigtail into the hole in the top of the frame.`});
      doc.push({type:"red_note", text:"*For safety, please keep hands on both the door and frame at this time, even if it is in a rested position*"});
    } else if (model.hanging === "rock_block" || model.hanging === "vertical_shaft") {
      if (model.id === "mf_mirror") {
        doc.push({type:"plain", text:`This door comes pre-hung and installs very similarly to a regular door. Do not remove the plastic wrap from around the door until it is in the rough opening. The wrapping is keeping the door closed and you do not want to open the door until it is in the rough opening.`});
        doc.push({type:"plain", text:`Attached to the bottom of the frame is a temporary threshold. This will need to be removed before the door system is put into the rough opening. We recommend laying the door down in front of the rough opening on the public side to remove the threshold. (Lay the door on the back of the frame so that the mirror is face up). Once the threshold is removed the door and frame can be stood up and put into place.`});
      } else if (f.hasThreshold) {
        doc.push({type:"plain", text:`This secret passage will install almost the same as an ordinary door and door frame would. Bring the frame near the rough opening for this secret door. Before putting it into the rough opening you will need to remove the temporary threshold of this frame. This temporary threshold was in place so the frame could be transported without the risk of the damaging the frame. To remove this threshold, take the screws out of the bottom as shown below. Once removed be sure to keep the vertical edges of the frame parallel so to not break any of the wood joints.`});
        doc.push({type:"plain", text:`Fit the Frame into position inside the Rough Opening. The Frame should be shimmed independently of the wall during the mounting process to hold the Frame level and plumb both left-to-right and front-to-back.`});
      } else {
        doc.push({type:"plain", text:`Fit the Frame into position inside the Rough Opening.${f.frameDepth === "inset_behind" ? " Push the Frame in until the back of the face frame touches the existing finish material." : " Bring the front of the door frame flush with the face of the drywall."}`});
      }
    } else if (model.hanging === "pivot_drop" && hasCab) {
      doc.push({type:"plain", text:`This secret passage comes pre-hung as a door system that will install almost the same as an ordinary door and door frame would. Carefully carry this door to the rough opening. Do not remove any of the cling wrap from the door as it is helping to hold the door closed. Fit the Door and Frame into position inside the Rough Opening.`});
    } else {
      doc.push({type:"plain", text:`Fit the Frame into position inside the Rough Opening.`});
    }

    if (!(model.hanging === "pivot_drop" && isOff && hasCab)) {
      // Standard frame plumb/level language (not needed if already provided above in offset+cab variant)
      doc.push({type:"plain", text:`The Door Frame should be shimmed independently of the wall during the mounting process to hold the Frame level and plumb both left-to-right and front-to-back.`});
      doc.push({type:"red_note", text:`*This will greatly influence how well your secret passageway operates, the recommended tolerance is limited to a 16th of an inch or less if possible*`});
    } else {
      doc.push({type:"plain", text:`With the door propped open at 90 degrees, you can now plumb and level the door. The door frame should be shimmed independently of the wall during the mounting process to hold the frame level and plumb both left-to-right and front-to-back.`});
      doc.push({type:"red_note", text:`*This will greatly influence how well your secret passageway operates, the recommended tolerance is limited to a 16th of an inch or less if possible.`});
      if (isOff) {
        doc.push({type:"plain", text:`The back side of the pilasters should be 14" from the face of the drywall as shown below. This spacing is important for a future step to allow the stationary cabinetry to tuck behind these pilasters.`});
      }
    }

    doc.push({type:"plain", text:`You will need to secure the frame with the ${sub.screws}. At this time, you will only be securing the Hinge Side of the Frame.`});
    doc.push({type:"red_note", text:"*Before driving each fastener, verify that the vertical sides of the door frame are still perfectly plumb, both side-to-side and front-to-back. Otherwise, the door will be a parallelogram, causing rubbing on the bottom of the frame, and requiring touch up work. The importance of leveling your secret passageway cannot be overstated. We recommend using a laser level. A bubble level is not accurate enough due to the height of your secret passageway and will cause issues during all steps of the installation process.*"});
    doc.push({type:"plain", text:"After checking in all directions, secure the Hinge Side of the frame with a single fastener in the upper-most hole. Continue checking to confirm that the Door Frame is in the correct, plumb position as you secure all remaining fasteners into the holes on the Hinge Side of the frame."});

    if (wt >= 400) {
      doc.push({type:"bold_warning", text:`NOTE: THIS DOOR IS EXTREMELY HEAVY. THE HINGE SIDE OF THE FRAME WILL SEE THE MOST LOAD. IT IS ABSOLUTELY CRITICAL THAT THE HINGE SIDE IS PERFECTLY PLUMB AND THAT THERE ARE NO GAPS BEHIND THE MOUNTING HOLES. SHIM BEHIND EVERY MOUNTING HOLE IF NECESSARY.`});
    }

    // ── 5. NON-HINGE SIDE ──
    const s5 = step();
    doc.push({type:"heading", text:`${s5}. INSTALL THE NON-HINGE SIDE OF THE FRAME:`});
    doc.push({type:"plain", text:`With the Hinge Side of the Door Frame fully secured, the Non-Hinge Side of the door should be much easier to secure in place.`});
    doc.push({type:"red_note", text:"*Before drilling for each through bolt, verify that the vertical sides of the door frame are still perfectly plumb, both side-to-side and front-to-back and held in place using shims*"});
    doc.push({type:"plain", text:`Set and check that the Non-Hinge Side of the Door Frame is plumb front-to-back before drilling and securing a fastener into the holes on the Non-Hinge Side of the Frame. Use shims to fill gaps in the wall so that the fasteners do not pull the side wall of the frame any further than what would still be plumb. Continue checking to confirm that the Frame is in the correct, plumb position as you secure all remaining fasteners on the Non-Hinge Side of the Door Frame.`});
    if (f.nonHingeOffset) {
      doc.push({type:"plain", text:`The non-hinge side should sit back 1/8" from the face of the wall. This is so when the door closes, the face of the door is flush with the face of the wall.`});
    }
    if (f.hasFloorTabs) {
      doc.push({type:"plain", text:"Once this frame is secured to the wall, the frame needs to be secured to the floor. At the front of the frame are two tabs with holes in them. Using the appropriate fasteners, secure these locations to the floor. This must be done before you can hang the door."});
    }

    // ── STATIONARY CABINETS (non-dual) ──
    if (hasCab && !isDualCab) {
      const sCab = step();
      doc.push({type:"heading", text:`${sCab}. INSTALL THE STATIONARY SECTIONS:`});
      doc.push({type:"plain", text:`Before attaching the stationary sections to the door frame and to the wall, you will need to mark out the stud locations that the stationary cabinets can attach to.${f.cabLabeled ? " The two stationary cabinets are labeled (e.g., A and B). Match the glass doors and lower cabinet doors with their respective cabinets." : " The two stationary sections are identical."} They can be carried into place next to the partly mounted frame.`});
      doc.push({type:"plain", text:`Using the supplied 1 1/4" flat head screws, attach the stationary cabinets to the door frame. The Frame should have screws put through the top of the frame into the header of the rough opening.`});
    } else if (!hasCab) {
      doc.push({type:"plain", text:"The Frame should have screws put through the top of the frame into the header of the rough opening."});
    }

    // ── DOOR HANGING ──
    const sHang = step();
    doc.push({type:"heading", text:`${sHang}. INSTALL THE DOOR:`});

    if (model.hanging === "pivot_drop") {
      doc.push({type:"plain", text:`The Wooden Door can be lifted by two people and easily hung with assistance from a third to set the threaded shafts into their corresponding bearings. In the pivot sets on the Door Frame there needs to be both bearings before hanging the door. The top pivot set should have a bearing already secured, while the bottom pivot set has a tapered roller bearing seat that is secured in place but will need the corresponding tapered roller bearing to be set inside.`});
      doc.push({type:"plain", text:`The Door has a top and bottom shaft by which it hangs. The bottom threaded shaft has been set in shop to the correct door height with a Jam Nut. Do not loosen the bottom shaft.`});
      doc.push({type:"plain", text:`To hang the door, you will need to tilt the back of the door backwards at a slight angle so that the top of the door can slip under the frame. (We recommend putting down a protective material like ram board to help protect the threshold while hanging the doors).`});
      doc.push({type:"plain", text:`Have a person on either end of the door and one in the middle hold onto the shelf. The people at the end use a second hand to support the back side of the door as you move it around. Have someone guide the bottom threaded shaft into the bottom bearing. Once the bottom bearing is set in place the door can be tilted back up right.`});
      doc.push({type:"plain", text:`Supplied is a 1" diameter keyed shaft about 3.5" long. Insert this shaft through the top of the door with the key in the correct orientation so that is goes into the flange collar on top of the door. Keep pushing until the end of the keyed shaft is completely seated in the top bearing. Once seated, you can tighten the 2 screws on the flange collar on top of the door with a 3/16 allen wrench. (if you have a mini ratchet with a 3/16" allen bit that is very useful as well).`});
      doc.push({type:"plain", text:`Once the top shaft is in its final position and the flange collar is tightened check that the door closes without any collisions.`});
    } else if (model.hanging === "rock_block") {
      doc.push({type:"plain", text:`Use extreme caution when moving the door. It is very heavy (approximately ${wt} lbs) and can easily cause injuries if extra caution is not taken. The Door is hung by two specialty hinges. Each hinge is secured by two Door Hinge Screws. Stand the door upright, then rock the door onto one of its corners and place a piece of wood underneath the raised side of the door. Then rock the door onto the corner that now has the wood underneath it to allow you to add another piece of wood under the other corner. Now that the door is raised off the floor, take a crowbar with an elbow in it to lift and move the door with more precision and leverage.`});
      doc.push({type:"plain", text:"You will need to very carefully align the top hinge in a way that a single hole is accessible and then loosely secure a single screw using a 3/16 inch allen key. Then hold the door in position and loosely secure one screw in the bottom hinge. Finally, raise or lower the door to align the last two Door Hinge Screws, and fully secure all Door Hinge Screws at this time. Until all screws are fully secured the Door cannot take any serious load."});
      if (postHang.includes("wire_conduit")) {
        doc.push({type:"plain", text:"Once the door is hung, attach the flexible wire conduit coming from the door to the frame. For systems with nested connectors: connect the smaller white connectors first, insert them into the tan housing mounted to the back of the door, then connect the tan pieces. Be gentle — do not force or damage the connectors."});
      }
      if (postHang.includes("cable_chain")) {
        doc.push({type:"plain", text:"If a cable chain is mounted to the top of the door, check for a disconnected link (disconnected for shipping). Snap the link back together before the door can operate."});
      }
    } else if (model.hanging === "vertical_shaft") {
      doc.push({type:"plain", text:`This door system is extremely heavy. Use extreme caution — it can very easily cause injuries.`});
      doc.push({type:"plain", text:`The door should be stood up on end in front of the frame. This door is hung by two shafts located at the top and the bottom of the door. The bottom shaft has a jam nut that is currently tight and it is setting the overall height of the door. DO NOT loosen this nut! Carefully set the bottom shaft into the previously placed race bearing. Once the bottom shaft has been inserted into the bottom bearing, the top shaft can be threaded up until it has entered the top bearing. Once in the top bearing the top jam nut can be tightened.`});
    } else if (model.hanging === "sliding") {
      doc.push({type:"plain", text:"Mount the sliding mechanism to the wall at the specified height per the Client Approval Drawing. Verify LEVEL with the laser. Position the threshold on the floor using a plumb bob from the slider. Secure the threshold to the finished floor. These screws will be inaccessible once the door is hung — confirm final position first."});
      doc.push({type:"plain", text:"Stand the bookcase upright. Set the bottom guide fin between the two blue guide wheels. Lift and insert the carriage bolt through the top of the bookcase into the sliding mechanism. Thread the nut."});
    }
  }

  // ═══════════════════════════════════════════════════════
  // SHARED STEPS (both single and dual-door paths merge)
  // ═══════════════════════════════════════════════════════

  // ── HINGE ADJUSTMENTS (MF doors) ──
  if (model.hanging === "rock_block") {
    const sAdj = step();
    doc.push({type:"heading", text:`${sAdj}. HINGE ADJUSTMENTS:`});
    doc.push({type:"plain", text:"Each door that we ship has been fully installed, tuned and tested in an opening identical to the one for which it was designed. This is done to ensure that you, the client, has minimal or hopefully no adjustments to make. The two specialty hinges that support your secret passageway can be adjusted in all directions if required but it is somewhat difficult and most likely unnecessary."});
    doc.push({type:"red_note", text:"IF IT APPEARS THAT ADJUSTMENTS NEED TO BE MADE, PLEASE CALL CREATIVE HOME ENGINEERING SO THAT WE CAN WALK YOU THROUGH THE PROCEDURE TO ACHIEVE YOUR DESIRED RESULT."});
    doc.push({type:"bold_warning", text:"DO NOT ADJUST YOUR HINGES WITHOUT CONTACTING CREATIVE HOME ENGINEERING."});
    doc.push({type:"plain", text:"Please be ready to confirm that your secret passageway frame is completely plumb in all directions for the quickest assistance as this is what causes issues with the alignment most of the time."});
  }

  // ── ADJUSTMENTS (pivot bookcase) ──
  if (model.hanging === "pivot_drop") {
    const sAdj = step();
    doc.push({type:"heading", text:`${sAdj}. WOOD DOOR ADJUSTMENTS:`});
    doc.push({type:"plain", text:"Each door that we ship has been fully installed, tuned and tested in an opening identical to the one for which it was designed. This is done to ensure that you, the client, has minimal or hopefully no adjustments to make. However, there are some adjustments that you should be aware of:"});
    if (warpId === "bolt") {
      doc.push({type:"plain", text:'a. Warp adjustment: Adding weight to the shelves of a secret door tends to cause the top outside corner to hang forward and the bottom outside corner to hang low. This is counteracted by either adding or subtracting weight to the shelves or turning the 9/16" warp adjustment bolt located on the bottom of the door near the outside corner. Tightening this bolt lifts the door and draws in the top outside corner. We have already adjusted this bolt based on the average loaded shelf weight of 100 pounds.'});
    }
    doc.push({type:"plain", text:'b. X, Y, and Z axis pivot set positioning: The locations of the pivot sets are easily adjustable in all 3 axes; however You should not need to adjust as the door was precisely tuned during production.'});
    doc.push({type:"red_note", text:"*If you think the top or bottom pivot location should be adjusted, notify us before attempting such an adjustment!*"});
    doc.push({type:"plain", text:'Usually, the problem is that the door is not plumb, flush, or the floor is still not perfectly leveled.'});
    doc.push({type:"red_note", text:"*Again, if you think your door requires this kind of adjustment, notify us before attempting this procedure! You risk the door unhinging itself if performed incorrectly!*"});
  }

  // ── STOP ARM & SHELF LOADING ──
  if (model.stopArm) {
    const sStop = step();
    doc.push({type:"heading", text:`${sStop}. SECURE THE STOP ARMS:`});
    doc.push({type:"plain", text:`Using the same 3/16" Allen Key, secure the Stop Arms in the top cavities so that the Rubber Stoppers will collide with the flat face of the Stop Arms when the Door begins to open. Make sure it is high enough that it will not collide with the false tops when it is put in.${isDual ? " Do this for both doors." : ""}`});

    const sLoad = step();
    doc.push({type:"heading", text:`${sLoad}. INSTALL THE SHELVES AND WEIGHT:`});
    doc.push({type:"plain", text:`This door has been tuned to operate with a load of approximately 100 pounds. If it is operated without any load, it may not function as desired, or close at all. Any rubbing or collisions are likely due to alignment issues with the Door Frame not being perfectly level on the floor or being inaccurately plumb. Verify that the ${doorWord} opens and closes smoothly without rubbing, this is to confirm that the Door is still aligned side-to-side for the magnetic lock in the electronics step. Weight is only required on the ${doorWord}.`});
  }

  // ── AUTO CLOSER ──
  if (closerId !== "none" && closerId !== "gravity") {
    const sCloser = step();
    doc.push({type:"heading", text:`${sCloser}. ATTACH THE AUTO CLOSER:`});
    if (closerId === "gas_spring") {
      doc.push({type:"plain", text:"A gas spring is shipped loose. Attach one ball-stud end to the bracket below the top hinge on the door. Attach the other end to the ball stud on the frame (hinge side). This is approximately a 20 lb gas spring and should be relatively easy to stretch to the ball studs. Insert the two safety pins (included in a small bag with the gas spring) through the small holes at each end after seating."});
    } else if (closerId === "arm_track") {
      doc.push({type:"plain", text:"Located at the top of the door is an auto closer. This will close the door behind the user. Coming off the auto closer is an arm that needs to be attached to the arm coming off the frame. Lift the arm slightly and seat the red wheel into the U-track on top of the door. Using the provided clevis pin, attach the two arms."});
    } else if (closerId === "slide_track") {
      doc.push({type:"plain", text:"An arm attached to the door connects to a white plastic slide that inserts into a track attached to the frame. Attach the arm to the door first, then pull the arm over and insert the white plastic slide into the frame track."});
    }
  }

  // ── ELECTRONICS ──
  const sElec = step();
  doc.push({type:"heading", text:`${sElec}. ELECTRONICS:`});
  if (isDual && f.electronicsInFalseTop) {
    doc.push({type:"plain", text:`- The electronics box has been installed in the false top of the frame. 110 VAC is to be put into the junction box which will power the transformer plugged into the junction box.`});
  } else {
    doc.push({type:"plain", text:`- The electronics box of this secret passageway is to be mounted on the wall inside of your secret room and close to your secret passageway.${f.electronicsLocation ? " " + f.electronicsLocation : " Refer to your \"Client Approval Drawing\" for more information."}`});
    doc.push({type:"plain", text:`The wiring from the box has all been labeled accordingly. In addition, there are extension wires that are extra-long to allow for flexibility in the installation location but can be shortened if necessary. All labelled wires should be connected to their corresponding connectors before the power cable is plugged in.`});
  }

  // Wire listing — lettered sub-items matching real manual format
  if (selectedWires.length > 0) {
    doc.push({type:"plain", text:"Your custom secret passageway will have:"});
    const letters = "abcdefghij";
    selectedWires.forEach((w, i) => {
      doc.push({type:"plain", text:`${letters[i] || String(i+1)}. One wire labeled ${w.label}. ${w.desc}`});
    });
  }

  if (!isDual || !f.electronicsInFalseTop) {
    doc.push({type:"plain", text:"The Power Plug is to be connected to a nearby electrical outlet. This secret passageway and electronics box are designed for a standard outlet."});
  }
  doc.push({type:"plain", text:`After the Power Cord has been plugged in, and all the wires fully connected, your system will have power, and you should be able to see that your ${maglockPlural} when the ${doorWord} ${isDual ? "are" : "is"} open.`});

  // Maglock test
  if (isDual) {
    doc.push({type:"plain", text:"Push the egress button and verify that the LED on the magnetic lock momentarily goes out."});
  } else {
    doc.push({type:"plain", text:"Push the door closed and the maglock LED light should turn green indicating that the door is locked."});
  }

  // Motorized homing
  if (hasMotor) {
    doc.push({type:"red_note", text:"MOTORIZED DOOR — HOMING SEQUENCE REQUIRED: (1) Clear all obstructions. (2) With door fully open, press and HOLD the Egress button for 7-10 seconds. (3) Door begins moving slowly toward closed (homing) — release button. (4) Door closes against the maglock. (5) Wait 10 seconds, press Egress again — door moves to fully open and contacts wall maglock. (6) Press Egress once more; door returns to closed. Verify green LED."});
  }

  // Methods of operation
  doc.push({type:"plain", text:`Your custom secret passageway has the following methods of operation. We recommend testing these switches before being outside the secret room.`});
  const methods = (f.ingressMethods||["egress_btn"]);
  const letters2 = "abcdefghij";
  methods.forEach((id, i) => {
    const m = INGRESS_METHODS.find(x=>x.id===id);
    if (m) doc.push({type:"plain", text:`${letters2[i] || String(i+1)}. ${m.methodDesc}`});
  });

  doc.push({type:"plain", text:`After confirming that all methods of entry and exit are functioning properly, you may close the ${doorWord}. While standing inside the secret area you should be able to locate the ${isDual ? "electromagnetic locks" : "electromagnetic lock"} when you close the ${doorWord} and see the LED turn green. If that is not the case and the LED remains red, your frame is likely still not level or not perfectly plumb.`});

  // ── COSMETIC FINISHING ──
  if (clad.includes("slatwall")) {
    const sPan = step();
    doc.push({type:"heading", text:`${sPan}. ATTACH THE PANELING TO THE WALL:`});
    doc.push({type:"plain", text:'Per the client approval drawing this door will be clad in a slatwall paneling. This product can be attached using a construction adhesive and brad nails.'});
    doc.push({type:"plain", text:'With the door in the closed position and the maglock turning green, we can begin attaching these panels. These panels should be cut so that there is a 3/16" gap on the top and on the bottom.'});
    doc.push({type:"plain", text:'The first panel should be attached to the hinge-side of the door with an over-hang of 13/16" as shown in the Client Approval Drawing. Continue attaching the paneling from the hinge side over to the non-hinge side.'});
    doc.push({type:"plain", text:'The stationary panels attach the same way but to the wall. Allow for a gap of about 1/16" (2 credit cards) between the stationary panels and the moving door panels. Be sure to have a 3/16" gap between the floor and ceiling to match the moving door panels.'});
  }

  if (clad.includes("french_cleat")) {
    const sMir = step();
    doc.push({type:"heading", text:`${sMir}. MOUNTING THE STATIONARY MIRROR:`});
    doc.push({type:"plain", text:'Supplied is an identical mirror that is to be mounted at the location of your choice. Included is a French Cleat that is to be used to hang the mirror on the wall. Note: The Wood that is on the back of the mirror is 3/4" thick. Do not use any hardware (including the supplied hardware) that will go through the 3/4" wood and risk breaking the glass. A 5/8" pan head wood screw is recommended for attaching the French cleat to the back of the mirror.'});
  }

  if (model.stopArm || hasCab || isDual) {
    // False tops, molding, scribes, toe kick — for bookcase systems
    const sFalse = step();
    doc.push({type:"heading", text:`${sFalse}. ATTACH THE FALSE TOP TO THE DOOR AND FRAME:`});
    doc.push({type:"plain", text:`Once the ${doorWord} ${isDual ? "are" : "is"} functioning properly, the false top to the ${doorWord} and frame can be installed. They are to be attached using the 1" long finish screws that use a #1 Square Bit.`});

    const sMold = step();
    doc.push({type:"heading", text:`${sMold}. ATTACHING THE TOP MOLDING:`});
    doc.push({type:"plain", text:`Once the ${doorWord} ${isDual ? "are" : "is"} functioning correctly and the ${maglockPlural2}, the top molding can be attached. The top molding will need to be spaced off the top of the pilasters the thickness of two credit cards. The molding can be attached using construction adhesive as well as brad nails.`});

    const sScribe = step();
    doc.push({type:"heading", text:`${sScribe}. ATTACH TOP SCRIBES:`});
    doc.push({type:"plain", text:`With the top molding attached, the top scribes can be attached. These span from pilaster to pilaster and are attached with a headless nailer. The moving scribe molding attached to the ${doorWord} should have a slight gap between them and the top molding. There are cut outs in the pilasters to allow for these scribes to move without colliding with the pilasters.`});

    const sToe = step();
    doc.push({type:"heading", text:`${sToe}. ATTACH THE TOE KICK:`});
    doc.push({type:"plain", text:`Once the pilasters are attached, the toe kick can be mounted. This toe kick spans from pilaster to pilaster.`});
  }

  if (clad.includes("wall_molding")) {
    const sMolding = step();
    doc.push({type:"heading", text:`${sMolding}. APPLY WALL MOLDING:`});
    doc.push({type:"plain", text:"Baseboard first (edge-banded side up, wall to wall). Then vertical moldings: space 1/16\" off the door on each side. Space remaining verticals equally. Then horizontal moldings at specified heights. Door-mounted moldings get a slight gap on each side. Confirm door still operates after each molding step."});
  }

  if (clad.includes("stone")) {
    const sStone = step();
    doc.push({type:"heading", text:`${sStone}. STONE APPLICATION:`});
    doc.push({type:"plain", text:"Apply stones to the MDF face using construction adhesive. Float each stone so it nearly touches the back of the existing stone surround. Keep within the metal structural boundaries of the door."});
  }

  // Back of door cladding for panel doors
  if (model.hanging === "rock_block" && !model.lockingPins) {
    const sBack = step();
    doc.push({type:"heading", text:`${sBack}. BACK OF THE DOOR CLADDING:`});
    doc.push({type:"plain", text:"The back of the door can have a cladding applied to it as shown in the client approval drawings. The cladding cannot over hang the current size of the back panel. We recommend adding a handle to the back of the door on top of the finished cladding to allow for closing the door from the inside of the secret room."});
  }

  // Special notes
  if (f.specialNotes) {
    doc.push({type:"plain", text:f.specialNotes});
  }

  // ── CLOSING ──
  doc.push({type:"closing", text:"Congratulations! You're finished. Please take some quick photos of the installation and email them to info@hiddenpassageway.com. We would also greatly appreciate your feedback regarding the product and the installation process so we can continue to improve in the future.\n\nThanks again for installing this hidden passageway system. If you have any problems during the installation process, please don't hesitate to call. We're here to serve you.\n\nSincerely,\nSteven Humble\nPresident\nCreative Home Engineering"});

  return { clientName: f.clientName || "Client", model: model.label, weight: wt, doc };
}

// ═══════════════════════════════════════════════════════════
// DOCX BUILDER — HTML-based .doc download
// ═══════════════════════════════════════════════════════════

async function buildDocx(manualData) {
  const d = manualData.doc;
  let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8">
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page{size:8.5in 11in;margin:0.9in 0.9in 0.7in 0.9in}
body{font-family:Calibri,Arial,Helvetica,sans-serif;font-size:11pt;line-height:1.5;color:#1a1a1a}
h1.title{font-size:22pt;font-weight:bold;margin:0 0 0pt;font-family:'Arial Black',Impact,sans-serif}
h1.subtitle{font-size:12pt;font-weight:normal;letter-spacing:2.5pt;margin:0 0 8pt}
.addr{text-align:right;font-size:9.5pt;color:#444444;line-height:1.5}
.title-bar{background:#eeeeee;border-left:4pt solid #1a5fa8;padding:7pt 14pt;margin:6pt 0 14pt;font-size:16pt;font-weight:bold;font-style:italic}
.center-warn{text-align:center;font-weight:bold;font-size:10.5pt;border:2pt solid #cc0000;color:#cc0000;padding:10pt 14pt;margin:10pt 0 14pt;line-height:1.5}
h2.sec{font-size:11pt;font-weight:bold;margin:13pt 0 5pt;padding-bottom:3pt;border-bottom:0.75pt solid #cccccc}
.red-note{color:#cc0000;font-weight:bold;font-style:italic;font-size:10.5pt;margin:5pt 0;line-height:1.45}
.bold-warn{font-weight:bold;font-size:10.5pt;margin:5pt 0}
p{margin:3pt 0;line-height:1.5}
.footer{border-top:1.5pt solid #1a1a1a;text-align:center;font-size:8.5pt;color:#555555;padding-top:6pt;margin-top:16pt}
.closing{margin-top:12pt;font-size:10.5pt;line-height:1.5}
</style></head><body>`;

  html += `<table width="100%" style="border-bottom:2.5pt solid #1a1a1a;padding-bottom:8pt;margin-bottom:4pt"><tr><td><h1 class="title">CREATIVE</h1><h1 class="subtitle">HOME ENGINEERING</h1></td><td class="addr">1325 N Melba Ct<br>Gilbert, AZ 85233<br>P: 480.899.3477<br>F: 866.470.5718<br>E: info@hiddenpassageway.com</td></tr></table>`;
  html += `<div class="title-bar">Installation Instructions</div>`;

  for (const item of d) {
    switch(item.type) {
      case "preamble":
        html += `<p>${item.text.replace(/We strongly recommend/, '<b>We strongly recommend').replace(/the installation\./, 'the installation.</b>')}</p>`;
        break;
      case "center_warning":
        html += `<div class="center-warn">${item.text}</div>`;
        break;
      case "heading":
        html += `<h2 class="sec">${item.text}</h2>`;
        break;
      case "bold_warning":
        html += `<p class="bold-warn">${item.text}</p>`;
        break;
      case "red_note":
        html += `<p class="red-note">${item.text}</p>`;
        break;
      case "plain":
        html += `<p>${item.text}</p>`;
        break;
      case "closing":
        html += `<p class="closing">${item.text.replace(/\n/g, '<br>')}</p>`;
        break;
    }
  }

  html += `<div class="footer">1325 N Melba Ct Gilbert AZ 85233 &#9642; 480-899-3477 &#9642; info@hiddenpassageway.com</div>`;
  html += `</body></html>`;

  const blob = new Blob(['\ufeff' + html], {type:'application/msword'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${manualData.clientName.replace(/[^a-zA-Z0-9_ -]/g,'').replace(/\s+/g,'_') || 'Install'}_Instructions.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════
const CL={bg:"#0d1017",card:"#151b27",border:"#1e2740",accent:"#2a7de1",accentSoft:"rgba(42,125,225,0.08)",red:"#d63031",redSoft:"rgba(214,48,49,0.06)",text:"#d5dae6",dim:"#6b7a99",white:"#f0f2f7"};

function Chip({label,active,onClick}){
  return <button onClick={onClick} style={{padding:"6px 13px",borderRadius:20,border:`1.5px solid ${active?CL.accent:CL.border}`,background:active?CL.accent:"transparent",color:active?"#fff":CL.dim,fontSize:12,fontWeight:active?600:500,cursor:"pointer",transition:"all 0.15s",whiteSpace:"nowrap"}}>{label}</button>;
}
function ChipGroup({label,options,value,onChange,multi,hint}){
  const vals=multi?(value||[]):[value];
  const toggle=id=>{if(multi){const s=new Set(vals);s.has(id)?s.delete(id):s.add(id);onChange([...s]);}else onChange(id);};
  return <div style={{marginBottom:18}}>
    <div style={{fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:CL.dim,marginBottom:5}}>{label}{multi&&<span style={{fontWeight:400,textTransform:"none",letterSpacing:0,marginLeft:6,opacity:0.7}}>(select all that apply)</span>}</div>
    {hint&&<div style={{fontSize:11,color:CL.dim,marginBottom:6,opacity:0.65}}>{hint}</div>}
    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{options.map(o=><Chip key={o.id} label={o.label} active={vals.includes(o.id)} onClick={()=>toggle(o.id)}/>)}</div>
  </div>;
}
function Toggle({label,checked,onChange}){
  return <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:12.5,color:CL.text,marginBottom:8}}>
    <div onClick={()=>onChange(!checked)} style={{width:36,height:19,borderRadius:10,background:checked?CL.accent:CL.border,position:"relative",transition:"background 0.2s",flexShrink:0}}>
      <div style={{width:15,height:15,borderRadius:8,background:"#fff",position:"absolute",top:2,left:checked?19:2,transition:"left 0.2s"}}/>
    </div>{label}
  </label>;
}

// ═══════════════════════════════════════════════════════════
// PREVIEW RENDERER
// ═══════════════════════════════════════════════════════════
function ManualPreview({data}){
  if(!data) return null;
  return <div style={{fontFamily:"'Segoe UI',sans-serif",maxWidth:820,margin:"0 auto",background:"#fff",color:"#1a1a1a",fontSize:13,lineHeight:1.6}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",borderBottom:"3px solid #1a1a1a",paddingBottom:14,marginBottom:6}}>
      <div><div style={{fontSize:26,fontWeight:900,fontFamily:"Impact,'Arial Black',sans-serif"}}>CREATIVE</div><div style={{fontSize:14,letterSpacing:2.5}}>HOME ENGINEERING</div></div>
      <div style={{textAlign:"right",fontSize:10.5,lineHeight:1.6,color:"#444"}}>1325 N Melba Ct<br/>Gilbert, AZ 85233<br/>P: 480.899.3477<br/>F: 866.470.5718<br/>E: info@hiddenpassageway.com</div>
    </div>
    <div style={{background:"#eee",borderLeft:"5px solid #1a5fa8",padding:"9px 16px",margin:"8px 0 18px"}}><h1 style={{fontSize:18,fontWeight:700,margin:0,fontStyle:"italic"}}>Installation Instructions</h1></div>
    {data.doc.map((item,i)=>{
      switch(item.type){
        case "preamble": return <p key={i} style={{marginBottom:6}}>{item.text.split("We strongly recommend").map((p,j)=>j===0?p:<span key={j}><b>We strongly recommend{item.text.split("We strongly recommend")[1]?.split("the installation.")[0]}the installation.</b>{item.text.split("the installation.").slice(1).join("")}</span>)}</p>;
        case "center_warning": return <div key={i} style={{textAlign:"center",fontWeight:700,fontSize:12,border:"2px solid #c00",color:"#c00",padding:"10px 16px",margin:"12px 0 18px",lineHeight:1.5}}>{item.text}</div>;
        case "heading": return <h2 key={i} style={{fontSize:13.5,fontWeight:700,margin:"16px 0 8px",paddingBottom:4,borderBottom:"1px solid #ccc"}}>{item.text}</h2>;
        case "bold_warning": return <p key={i} style={{fontWeight:700,margin:"6px 0"}}>{item.text}</p>;
        case "red_note": return <p key={i} style={{color:"#c00",fontWeight:700,fontStyle:"italic",margin:"6px 0",fontSize:12.5}}>{item.text}</p>;
        case "plain": return <p key={i} style={{margin:"4px 0"}}>{item.text}</p>;
        case "closing": return <p key={i} style={{marginTop:16,whiteSpace:"pre-line",lineHeight:1.55}}>{item.text}</p>;
        default: return null;
      }
    })}
    <div style={{borderTop:"2px solid #1a1a1a",marginTop:24,paddingTop:8,textAlign:"center",fontSize:10,color:"#555"}}>1325 N Melba Ct Gilbert AZ 85233 ▪ 480-899-3477 ▪ info@hiddenpassageway.com</div>
  </div>;
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function SecretDoorApp(){
  const [view,setView]=useState("input");
  const [manual,setManual]=useState(null);
  const [f,setF]=useState({
    clientName:"",doorModel:"pivot_bookcase",doorWeight:"350",wallSubstrate:"wood",
    frameDepth:"inset_flush",swingDirection:"left",swingType:"inswing",
    doorConfig:"single",dualFirstSide:"right",
    cabinetConfig:"none",
    autoCloser:"gravity",warpMethod:"bolt",
    ingressMethods:["egress_btn","book_tilt"],
    selectedWires:["maglock","egress"],wireDescs:{},
    claddingOptions:["shelves_books"],postHangOptions:[],
    nonHingeOffset:false,hasFloorTabs:false,cabLabeled:false,hasLadder:false,
    hasThreshold:false,includeYouTube:false,electronicsInFalseTop:false,
    doorNumber:"1",doorSideLabel:"Left Door",
    electricalNotes:"",electronicsLocation:"",specialNotes:""
  });
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const setModel=id=>{const m=DOOR_MODELS.find(x=>x.id===id);setF(p=>({...p,doorModel:id,autoCloser:m?.closerDefault||p.autoCloser,warpMethod:m?.warpMethod||p.warpMethod}));};
  const model=DOOR_MODELS.find(m=>m.id===f.doorModel)||DOOR_MODELS[0];
  const inputSt={width:"100%",padding:"8px 12px",border:`1px solid ${CL.border}`,borderRadius:8,background:CL.card,color:CL.text,fontSize:13,outline:"none",boxSizing:"border-box"};

  const doGenerate=()=>{const m=generateManualData(f);setManual(m);setView("preview");};
  const doDownload=()=>{if(manual)buildDocx(manual);};

  const setWireDesc=(wireId,desc)=>{
    setF(p=>({...p,wireDescs:{...p.wireDescs,[wireId]:desc}}));
  };

  if(view==="input") return (
    <div style={{minHeight:"100vh",background:CL.bg,color:CL.text,fontFamily:"'Segoe UI',-apple-system,sans-serif"}}>
      <div style={{borderBottom:`1px solid ${CL.border}`,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,background:"linear-gradient(135deg,#1a5fa8,#2980c9)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="18" height="18" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 7v8c0 6 4.5 11 10 13 5.5-2 10-7 10-13V7L14 2z" stroke="white" strokeWidth="2" fill="none"/><path d="M10 14l3-6v5h5l-3 6v-5h-5z" fill="white"/></svg>
          </div>
          <div><div style={{fontSize:15,fontWeight:700}}>Secret Door Architect</div><div style={{fontSize:10.5,color:CL.dim}}>V3 — Word Document Generator</div></div>
        </div>
      </div>
      <div style={{maxWidth:700,margin:"28px auto",padding:"0 20px"}}>
        <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 4px"}}>New Installation Manual</h2>
        <p style={{color:CL.dim,margin:"0 0 22px",fontSize:12}}>Configure all options below. Generates a downloadable Word document matching the CHE manual format.</p>

        <div style={{marginBottom:18}}><div style={{fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:CL.dim,marginBottom:5}}>Client / Project Name</div>
          <input value={f.clientName} onChange={e=>set("clientName",e.target.value)} placeholder="e.g., Marino Residence" style={inputSt}/></div>

        <ChipGroup label="Door Model" options={DOOR_MODELS} value={f.doorModel} onChange={setModel}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
          <div><div style={{fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:CL.dim,marginBottom:5}}>Door Weight (lbs)</div>
            <input type="number" value={f.doorWeight} onChange={e=>set("doorWeight",e.target.value)} style={inputSt}/></div>
          <ChipGroup label="Hinge Side" options={[{id:"left",label:"Left Hinge"},{id:"right",label:"Right Hinge"}]} value={f.swingDirection} onChange={v=>set("swingDirection",v)}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
          <ChipGroup label="Swing Type" options={SWING_TYPES} value={f.swingType} onChange={v=>set("swingType",v)} hint="Direction door opens relative to the secret room."/>
          <ChipGroup label="Door Configuration" options={DOOR_CONFIGS} value={f.doorConfig} onChange={v=>{set("doorConfig",v); if(v==="double_shared") set("cabinetConfig","dual_door");}}/>
        </div>
        {f.doorConfig === "double_shared" && (
          <div style={{background:CL.accentSoft,border:`1px solid ${CL.accent}33`,borderRadius:10,padding:"12px 16px",marginBottom:18}}>
            <div style={{fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:CL.accent,marginBottom:8}}>Double Door — Shared Frame Options</div>
            <ChipGroup label="Install first side" options={[{id:"right",label:"Right Side First"},{id:"left",label:"Left Side First"}]} value={f.dualFirstSide} onChange={v=>set("dualFirstSide",v)} hint="Which side of the frame gets secured first (Christy Hill = Right Side first)"/>
            <Toggle label="Electronics box in false top (not wall-mounted)" checked={f.electronicsInFalseTop} onChange={v=>set("electronicsInFalseTop",v)}/>
          </div>
        )}
        {f.doorConfig === "double_separate" && (
          <div style={{background:CL.accentSoft,border:`1px solid ${CL.accent}33`,borderRadius:10,padding:"12px 16px",marginBottom:18}}>
            <div style={{fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:CL.accent,marginBottom:8}}>Double Door — Separate Frames</div>
            <div style={{fontSize:11,color:CL.dim,marginBottom:8}}>Each door gets its own manual. Configure this manual for one of the two doors.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div><div style={{fontSize:10,fontWeight:600,color:CL.dim,marginBottom:2}}>Door Number</div>
                <select value={f.doorNumber} onChange={e=>set("doorNumber",e.target.value)} style={inputSt}><option value="1">Door 1 of 2</option><option value="2">Door 2 of 2</option></select></div>
              <div><div style={{fontSize:10,fontWeight:600,color:CL.dim,marginBottom:2}}>Door Label</div>
                <input value={f.doorSideLabel} onChange={e=>set("doorSideLabel",e.target.value)} placeholder="e.g., Left Door" style={inputSt}/></div>
            </div>
          </div>
        )}
        <ChipGroup label="Frame Mounting Depth" options={FRAME_DEPTHS} value={f.frameDepth} onChange={v=>set("frameDepth",v)}/>
        <ChipGroup label="Wall Substrate" options={WALL_SUBSTRATES} value={f.wallSubstrate} onChange={v=>set("wallSubstrate",v)}/>
        <ChipGroup label="Stationary Cabinets" options={CABINET_CONFIGS} value={f.cabinetConfig} onChange={v=>set("cabinetConfig",v)}/>
        <ChipGroup label="Auto-Closer" options={AUTO_CLOSERS} value={f.autoCloser} onChange={v=>set("autoCloser",v)}/>
        <ChipGroup label="Warp / Torsion Method" options={WARP_METHODS} value={f.warpMethod} onChange={v=>set("warpMethod",v)}/>
        <ChipGroup label="Ingress / Egress Methods" options={INGRESS_METHODS} value={f.ingressMethods} onChange={v=>set("ingressMethods",v)} multi hint="Egress Button always included."/>
        <ChipGroup label="Cladding / Finish" options={CLADDING_OPTIONS} value={f.claddingOptions} onChange={v=>set("claddingOptions",v)} multi/>
        <ChipGroup label="Post-Hanging Connections" options={POST_HANG_OPTIONS} value={f.postHangOptions} onChange={v=>set("postHangOptions",v)} multi/>

        {/* Wire Labels with per-wire descriptions */}
        <div style={{background:CL.card,border:`1px solid ${CL.border}`,borderRadius:10,padding:"12px 16px",marginBottom:18}}>
          <div style={{fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:CL.dim,marginBottom:8}}>Wire Labels (Electronics Section)</div>
          <div style={{fontSize:11,color:CL.dim,marginBottom:8,opacity:0.65}}>Select which wires are present. Each wire gets a lettered sub-item (a, b, c...) in the electronics section.</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
            {WIRE_LABELS.map(w=>{
              const active=(f.selectedWires||[]).includes(w.id);
              return <Chip key={w.id} label={w.label} active={active} onClick={()=>{
                const s=new Set(f.selectedWires||[]);
                s.has(w.id)?s.delete(w.id):s.add(w.id);
                set("selectedWires",[...s]);
              }}/>;
            })}
          </div>
          {(f.selectedWires||[]).map(wid=>{
            const w=WIRE_LABELS.find(x=>x.id===wid);
            if(!w) return null;
            return <div key={wid} style={{marginBottom:6}}>
              <div style={{fontSize:10,fontWeight:600,color:CL.accent,marginBottom:2}}>{w.label}</div>
              <input value={(f.wireDescs&&f.wireDescs[wid])||""} onChange={e=>setWireDesc(wid,e.target.value)} placeholder={w.defaultDesc} style={{...inputSt,fontSize:11}}/>
            </div>;
          })}
        </div>

        <div style={{background:CL.card,border:`1px solid ${CL.border}`,borderRadius:10,padding:"12px 16px",marginBottom:18}}>
          <div style={{fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:CL.dim,marginBottom:8}}>Additional Options</div>
          <Toggle label="Include YouTube installation video link" checked={f.includeYouTube} onChange={v=>set("includeYouTube",v)}/>
          <Toggle label="Door has temporary threshold (remove before install)" checked={f.hasThreshold} onChange={v=>set("hasThreshold",v)}/>
          <Toggle label={'Non-hinge side set back 1/8" (door flush with wall)'} checked={f.nonHingeOffset} onChange={v=>set("nonHingeOffset",v)}/>
          <Toggle label="Frame has floor anchor tabs" checked={f.hasFloorTabs} onChange={v=>set("hasFloorTabs",v)}/>
          <Toggle label="Cabinets are labeled (A, B, etc.)" checked={f.cabLabeled} onChange={v=>set("cabLabeled",v)}/>
          <Toggle label="Library Ladder included" checked={f.hasLadder} onChange={v=>set("hasLadder",v)}/>
        </div>

        <div style={{marginBottom:14}}><div style={{fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:CL.dim,marginBottom:5}}>Electrical Routing Notes</div>
          <textarea value={f.electricalNotes} onChange={e=>set("electricalNotes",e.target.value)} placeholder='e.g., 110V AC pigtail is to be located at the top of the rough opening, 35 1/2" from the right side...' rows={2} style={{...inputSt,resize:"vertical",fontSize:11.5}}/></div>

        <div style={{marginBottom:14}}><div style={{fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:CL.dim,marginBottom:5}}>Electronics Box Location Notes</div>
          <textarea value={f.electronicsLocation} onChange={e=>set("electronicsLocation",e.target.value)} placeholder='e.g., Refer to your "Client Approval Drawing" for more information.' rows={1} style={{...inputSt,resize:"vertical",fontSize:11.5}}/></div>

        <div style={{marginBottom:20}}><div style={{fontSize:10.5,fontWeight:600,textTransform:"uppercase",letterSpacing:1.2,color:CL.dim,marginBottom:5}}>Special Notes</div>
          <textarea value={f.specialNotes} onChange={e=>set("specialNotes",e.target.value)} placeholder="e.g., Tile floor, no forklift access..." rows={2} style={{...inputSt,resize:"vertical"}}/></div>

        <button onClick={doGenerate} style={{width:"100%",padding:"13px 0",background:"linear-gradient(135deg,#1a5fa8,#2573b8)",color:"#fff",border:"none",borderRadius:10,fontSize:14.5,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 18px rgba(26,95,168,0.3)"}}>
          ⚡ Generate Installation Manual
        </button>
        <div style={{height:36}}/>
      </div>
    </div>
  );

  // PREVIEW
  return (
    <div style={{minHeight:"100vh",background:"#e8e8e8",fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{background:"#151b27",color:CL.text,padding:"10px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 2px 10px rgba(0,0,0,0.3)"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:30,height:30,background:"linear-gradient(135deg,#1a5fa8,#2980c9)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="14" height="14" viewBox="0 0 28 28" fill="none"><path d="M14 2L4 7v8c0 6 4.5 11 10 13 5.5-2 10-7 10-13V7L14 2z" stroke="white" strokeWidth="2" fill="none"/></svg>
          </div>
          <span style={{fontWeight:700,fontSize:13}}>Manual Preview</span>
          <span style={{color:CL.dim,fontSize:11.5,marginLeft:4}}>— {manual?.clientName}</span>
        </div>
        <div style={{display:"flex",gap:7}}>
          <button onClick={()=>setView("input")} style={{background:"rgba(255,255,255,0.07)",border:`1px solid ${CL.border}`,color:"#c0c4d8",borderRadius:7,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:600}}>← Edit</button>
          <button onClick={doDownload} style={{background:"linear-gradient(135deg,#1a8a3a,#27a844)",border:"none",color:"#fff",borderRadius:7,padding:"6px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>📄 Download .doc</button>
        </div>
      </div>
      <div style={{maxWidth:880,margin:"24px auto",padding:"40px 40px 32px",background:"#fff",boxShadow:"0 4px 20px rgba(0,0,0,0.12)",borderRadius:2}}>
        <ManualPreview data={manual}/>
      </div>
    </div>
  );
}
