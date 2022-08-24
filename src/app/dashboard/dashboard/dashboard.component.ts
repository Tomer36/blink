import { Component, OnInit } from '@angular/core';
import { PostService } from "src/app/services/post.service";
import { Order } from 'src/app/models/Order';
import { Subscription } from "rxjs";
import { Table } from 'src/app/models/Table';
import { ShareDataService } from 'src/app/services/share-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  orders:Order[] = [];
  tables:Table[] = [];
  order: Order | any;
  timeDate: string | any;
  private ordersSub: Subscription = new Subscription;

  constructor(private postService: PostService, private sharedData: ShareDataService, private router: Router) { }

  ngOnInit(): void {
    if(!this.postService.isAdminLoggedIn())
        this.router.navigateByUrl('/login');

    this.orders = this.postService.loadState('orders');
    this.tables = this.postService.loadState('tables');
    this.fetchOccupiedTables()
    this.checkTableLeft()
    this.fetchOrders()
    setInterval(() => {
      this.fetchOccupiedTables()
      this.checkTableLeft()
      this.fetchOrders()
    }
    , 2000);
    // this.fetchOrders()
    // setInterval(() => this.fetchOrders(), 2000);
    // this.sharedData.token$.subscribe(table => {
    //   console.log(table)
    // });
  }
  ngOnDestroy(): void {
    this.ordersSub.unsubscribe();
  }

  fetchOrders(){
      this.postService.getOrderTest()
      .subscribe((request)=>{
        console.log(request)
        this.raw(request);
      });
      }
  fetchOccupiedTables(){
      this.postService.getOccupiedTables()
      .subscribe((request)=>{
        console.log(request)
        this.raw2(request);
      });
      }
  checkTableLeft(){
      this.postService.onLeaveTable()
      .subscribe((request)=>{
        console.log(request)
        this.raw3(request);
      });
      }

      raw(req: any){
        // this.order = req.order
        if(req.order){
      this.orders.push(req.order)
      console.log(this.orders);
      this.postService.saveState('orders', this.orders);
  }
  }
      raw2(req: any){
        if(req.table){
          req.table.timeDate = this.getTimeDate()
          this.tables.push(req.table);
         }
        console.log(this.tables);
        this.postService.saveState('tables', this.tables);
        // this.order = req.order
        // if(req.table && this.tables.indexOf(table) !== -1){
      // this.tables.push(req.table)
        // console.log(this.tables);
  // }
  }
      raw3(req: any){
        if(req.table){
          this.tables.splice(this.tables.findIndex(t => t.tableId === req.table.tableId),1);
         }
        console.log(this.tables);
        this.postService.saveState('tables', this.tables);
  }

  onCompleteOrder(i: any){
    this.orders.splice(i,1);
    console.log("compelete",this.orders)
    this.postService.saveState('orders', this.orders);
  }

  getTimeDate(){
    const dateTime = new Date()
    return `${dateTime.getHours()}:${dateTime.getUTCMinutes()} ${dateTime.getDate()}/${dateTime.getUTCMonth() + 1 }/${dateTime.getFullYear()}`;

  }

}
