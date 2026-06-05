Tôi đang triển khai 1 hệ thống thế này, đang sử dụng Supabase, hãy mô tả cho tôi cần tạo những bảng gì và viết Policies thế nào:
+ Hệ thống đặt đồ ăn qua menu, sẽ có 2 đối tượng sử dụng là customer (khách hàng) và admin (quản trị viên). 
+ customer  sẽ không cần đăng nhập, có thể quét mã QR để xem menu của shop luôn, khi vào website, chỉ cần nhập tên của mình sẽ chuyển vào màn hình đặt đồ 
-> xem thông tin đồ ăn trên menu, đặt đồ, số lượng -> bấm thanh toán là xong (chọn hình thức thanh toán) 
-> hệ thống sẽ lưu lại thông tin đơn hàng. Khách hàng chỉ có thể tạo đơn hàng và xem thông tin đơn hàng vừa đặt, không thể xóa
+ admin sẽ cần đăng nhập để vào trang quản trị viên, admin có thể xem danh sách tất cả đơn hàng, chi tiết đơn hàng, phê duyệt trạng thái và xóa đơn hàng
+ admin có thể xem, thêm và chỉnh sửa số lượng hàng hóa trong kho. Dựa vào số lượng hàng hóa và đơn hàng để hiển thị những mặt hàng đã hết (không cho user đặt)


Màn hình customer:
+ 


Đây là các bảng của tôi, hãy review cho tôi:

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);



CREATE TABLE profiles (

  id UUID PRIMARY KEY, -- = auth.uid()

  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,



  name TEXT,

  role TEXT CHECK (role IN ('admin')) NOT NULL DEFAULT 'admin',



  created_at TIMESTAMPTZ DEFAULT now()

);



CREATE TABLE menus (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,



  name TEXT NOT NULL,

  price NUMERIC(18,2) NOT NULL,

  image_url TEXT,

  is_available BOOLEAN DEFAULT true,



  created_at TIMESTAMPTZ DEFAULT now()

);



CREATE TABLE orders (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,



  customer_name TEXT NOT NULL,

  customer_token TEXT NOT NULL, -- 🔥 key cho anonymous user



  status TEXT NOT NULL DEFAULT 'pending',



  payment_method TEXT,



  total_price NUMERIC(18,2) NOT NULL DEFAULT 0,



  created_at TIMESTAMPTZ DEFAULT now()

);



CREATE TABLE order_items (

  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,



  menu_id UUID REFERENCES menus(id),



  name TEXT NOT NULL,        -- snapshot

  price NUMERIC(18,2) NOT NULL, -- snapshot

  quantity INT NOT NULL CHECK (quantity > 0),



  created_at TIMESTAMPTZ DEFAULT now()

);



CREATE INDEX idx_orders_org ON orders(organization_id);

CREATE INDEX idx_orders_token ON orders(customer_token);



CREATE INDEX idx_order_items_order ON order_items(order_id);



CREATE INDEX idx_menus_org ON menus(organization_id);



CREATE INDEX idx_profiles_org ON profiles(organization_id);

