
import { Component, OnInit, createPlatformFactory } from '@angular/core';
// import {CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CdkDragDrop, CdkDragStart, CdkDragEnd, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { data } from 'jquery';
import { loginDataBuilder } from '../shared/login-data.builder';
import { DroplistDataService } from './droplistdata.service';
import { FormGroup, FormBuilder } from '@angular/forms';

/**
 * @title Drag&Drop connected  group
 */

@Component({
  selector: 'dragdropconnectedgroup',
  templateUrl: 'droplistdata.component.html',
  styleUrls: ['droplistdata.component.css'],
})
export class DragDropConnectedGroup implements OnInit {
  adminRights = [
    'Wallet Owner View',
    'Wallet Owner Edit',
    'Wallet Owner Create',
    'Group View',
    'Group Edit',
    'Group Create',
    'Template View',
    'Template Edit',
    'Template Create',
    'Commision View',
    'Commision Edit',
    'Commision Create',
    'Role View',
    'Role Edit',
    'Role Create',
    'System User View',
    'System User Edit',
    'System User Create'


  ];

  selectedRights = [
    'Wallet Owner View',
    'Template View',
    'Commision View',
    'Group View',
    'Role View',
    'System User View',
  ];



  data: any[];
  roleName: string = '';
  allgroup: any[];  group1: any[];  group2: any[];
  cdkform : FormGroup;

  constructor(private loginDataBuilder: loginDataBuilder,private formBuilder: FormBuilder, private service: DroplistDataService) {
  }
  ngOnInit() {
    this.roleName = this.loginDataBuilder.userName;
    this.service.groupMaster().subscribe(data => {
  
      this.allgroup = data.groupList;
      this.group1 =  data.groupList;
      this.group2 =  data.groupList;
    });
   this.createForm();
   
  }
  createForm(){
    this.cdkform = this.formBuilder.group({ 
      group1 : ['-1'],
      group2 : ['-1'],
    });
  
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.item.element.nativeElement.classList.contains("selected")) {
      this.multiDrag.dropListDropped(event);
    }
    // If dont have ".selected" (normal case)
    else {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
    }
  }


  multiSelect = { // Put ".selected" on elements when clicking after longPress or Ctrl+Click
    // Initial Variables
    longPressTime: 500, // in ms unit
    verifyLongPress: 0,
    multiSelect: false,
    verifyDragStarted: false,
    ctrlMode: false,
    firstContainer: null as unknown as HTMLElement,

    selectDrag(el: HTMLElement) {
      while (!el.classList.contains("cdk-drag")) {
        el = el.parentElement as HTMLElement;
      }
      return el;
    },

    mouseDown(e: Event) {
      var target = this.selectDrag(e.target as HTMLElement);
      let ctrlKey = (<KeyboardEvent>e).ctrlKey;

      if (this.multiSelect) { // If multiSelect is enabled
        /* The responsibility for removing only the first ".selected" has to be with mouseDown and not with mouseUp.
        if not you can't add the first one */
        // Remove
        let allSelected = document.querySelectorAll(".selected").length;
        if (allSelected == 1 && target.classList.contains("selected") && (this.ctrlMode ? ctrlKey : true)) { // If only have one ".selected" and it was clicked
          target.classList.remove("selected");  // remove ".selected"
          this.multiSelect = false; // turns off multiSelect
        }
      }

      else { // If multiSelect is disabled
        // Do this
        let addSelected = () => {
          this.multiSelect = true; // enable multiSelect
          this.firstContainer = target.parentElement as HTMLElement; //saves the container of the first selected element
          target.classList.add("selected"); // and add ".selected" to the current element clicked
        }

        // If using CTRL
        if (ctrlKey) {
          this.ctrlMode = true;
          addSelected();
        };

        // If using longPress
        this.verifyLongPress = setTimeout(() => { // If there is a LongPress
          this.ctrlMode = false;
          addSelected();
        }, this.longPressTime); // after "longPressTime"(ms)
      }
    },

    mouseUp(e: Event) {
      clearTimeout(this.verifyLongPress); // cancel LongPress

      if (this.multiSelect) { // If multiSelect is enabled
        var target = this.selectDrag(e.target as HTMLElement);
        let allSelected = document.querySelectorAll(".selected");
        let ctrlKey = (<KeyboardEvent>e).ctrlKey;

        // If not start DragStarted
        if (!this.verifyDragStarted) {

          // To remove from selection
          /* responsibility to remove from selection assigned to mouseUp */
          if (target.classList.contains("selected")) { // If the clicked element already has ".selected"
            if (allSelected.length > 1 && (this.ctrlMode ? ctrlKey : true)) { // If you have more than 1 (not to remove the first one added)
              target.classList.remove("selected"); // remove ".selected"
            }
          }

          // To add to selection
          else { // if the clicked element does not have the ".selected"
            if (this.firstContainer == target.parentElement && (this.ctrlMode ? ctrlKey : true)) { //if the item click is made within the same container
              target.classList.add("selected"); // add ".selected"
            }
            else if (this.ctrlMode ? ctrlKey : true) { // if in different container, and with ctrl (if ctrl)
              allSelected.forEach((el) => { // remove all selected
                el.classList.remove("selected");
                el.classList.remove("hide");
              });
              this.firstContainer = target.parentElement as HTMLElement; //saves the container of the new selected element
              target.classList.add("selected"); // and add ".selected" to the element clicked
            }
          }

        }
      }
    },

    dragStarted() {
      this.verifyDragStarted = true; // shows to mouseDown and mouseUp that Drag started
      clearTimeout(this.verifyLongPress); // cancel longPress
    },

    dragEnded() {
      this.verifyDragStarted = false; // show mouseDown and mouseUp that Drag is over
    },

    dropListDropped(e: CdkDragDrop<string[]>) {
      let el = e.item.element.nativeElement;
      if (el.classList.contains("selected")) { // the dragged element was of the "selected" class
        this.multiSelect = false; // disable multiSelect
      }
    },

  }


  multiDrag = { // Adjusts clicked items that have ".selected" to organize together
    // Initial Variables
    dragList: [""], // has the value of the selected items in sequence from listData
    dragListCopy: [""], // a copy of the listData, but with the selected elements marked with "DragErase" to delete later
    dragErase: Symbol("DragErase") as any, // a symbol to have unique value when deleting

    dragStarted(e: CdkDragStart) {
      if (e.source.element.nativeElement.classList.contains("selected")) { // If the dragged element has ".selected"
        //prepare
        let listData = e.source.dropContainer.data; // get list data value
        this.dragList = []; // reset the dragList
        this.dragListCopy = [...listData]; // copy listData into variable
        let DOMdragEl: any = e.source.element.nativeElement; // dragged element
        let DOMcontainer = [...DOMdragEl.parentElement!.children]; // container where all draggable elements are
        let DOMdragElIndex = DOMcontainer.indexOf(DOMdragEl); // index of the dragged element
        let allSelected = document.querySelectorAll(".selected"); // get all the ".selected"

        // Goes through all ".selected"
        allSelected.forEach((eli) => {
          // get index of current element
          let CurrDOMelIndexi = DOMcontainer.indexOf(eli);

          // Add listData of current ".selected" to dragList
          this.dragList.push(listData[CurrDOMelIndexi]);

          // Replaces current position in dragListCopy with "DragErase" (to erase exact position later)
          this.dragListCopy[CurrDOMelIndexi] = this.dragErase;

          // Put opacity effect (by CSS class ".hide") on elements (after starting Drag)
          if (DOMdragElIndex !== CurrDOMelIndexi) {
            eli.classList.add("hide");
          }
        });

      }
    },

    dropListDropped(e: CdkDragDrop<string[]>) {

      if (e.previousContainer === e.container) { // If in the same container

        let posAdjust = e.previousIndex < e.currentIndex ? 1 : 0; // Adjusts the placement position
        this.dragListCopy.splice(e.currentIndex + posAdjust, 0, ...this.dragList); // put elements in dragListCopy
        this.dragListCopy = this.dragListCopy.filter((el) => (el !== this.dragErase)); // remove the "DragErase" from the list

        // Pass item by item to final list
        for (let i = 0; i < e.container.data.length; i++) {
          e.container.data[i] = this.dragListCopy[i];
        }

      }

      else { // If in different containers

        // remove the "DragErase" from the list
        this.dragListCopy = this.dragListCopy.filter((el) => (el !== this.dragErase));

        // Pass item by item to initial list
        for (let i = 0; i < e.previousContainer.data.length; i++) {
          e.previousContainer.data[i] = this.dragListCopy[i];
        }
        for (let i = 0; i < this.dragList.length; i++) {
          e.previousContainer.data.pop();
        }


        let otherListCopy = [...e.container.data]; // list of new container
        otherListCopy.splice(e.currentIndex, 0, ...this.dragList); // put elements in otherListCopy

        // Pass item by item to final list
        for (let i = 0; i < otherListCopy.length; i++) {
          e.container.data[i] = otherListCopy[i];
        }

      }

      // Remove ".selected" and ".hide"
      setTimeout(() => {
        let allSelected = document.querySelectorAll(".selected");
        allSelected.forEach((el) => {
          el.classList.remove("selected");
          el.classList.remove("hide");
        });
      }, 0)

      this.dragListCopy = []; // reset the dragListCopy
      this.dragList = []; // reset the dragList
    },

  }


  checkApplicableGroup2(event: any) {
  this.group2 =  this.allgroup.map(a => Object.assign({}, a));
  if(event.target.value != ''){
    this.group2.forEach(element => {
      if(event.target.value === element.code) {
        const index: number = this.group2.indexOf(element);
        element = { ...element, disabled: true };
        this.group2.splice(index, 1, element);
      }
    });
  }
  }
  checkApplicableGroup1(event: any) {
   
    this.group1 =  this.allgroup.map(a => Object.assign({}, a));
   if(event.target.value != ''){
     this.group1.forEach(element => {
       if(event.target.value === element.code) {
         const index: number = this.group1.indexOf(element);
         element = { ...element, disabled: true };
         this.group1.splice(index, 1, element);
       }
     });
   }
   }

 
 

  

}