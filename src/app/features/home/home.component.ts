import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero">
      <div class="container">
        <h1>Chia sẻ công thức, lên kế hoạch bữa ăn</h1>
        <p>
          Mạng xã hội dành cho người yêu bếp — tạo công thức, lên meal planner,
          tự động sinh shopping list và bước vào cooking mode.
        </p>
        <div class="hero-actions">
          <a routerLink="/recipes"><button>Khám phá công thức</button></a>
          <a routerLink="/auth/register"><button class="btn-secondary">Đăng ký ngay</button></a>
        </div>
      </div>
    </section>

    <section class="features container">
      <div class="card">
        <h3>Quản lý công thức</h3>
        <p>Tạo, chỉnh sửa, phân loại và chia sẻ công thức với hình ảnh đẹp.</p>
      </div>
      <div class="card">
        <h3>Meal Planner</h3>
        <p>Lên kế hoạch bữa ăn theo ngày/buổi, kéo thả cực kỳ tiện lợi.</p>
      </div>
      <div class="card">
        <h3>Shopping List</h3>
        <p>Tự động tổng hợp nguyên liệu từ meal plan — check-off khi đi chợ.</p>
      </div>
      <div class="card">
        <h3>Cooking Mode</h3>
        <p>Giao diện tối ưu khi đứng bếp, tích hợp Timer cho từng bước.</p>
      </div>
    </section>
  `,
  styleUrl: './home.component.scss'
})
export class HomeComponent {}
