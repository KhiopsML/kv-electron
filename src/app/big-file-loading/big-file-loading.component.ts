/*
 * Copyright (c) 2023-2025 Orange. All rights reserved.
 * This software is distributed under the BSD 3-Clause-clear License, the text of which is available
 * at https://spdx.org/licenses/BSD-3-Clause-Clear.html or see the "LICENSE" file for more details.
 */

import { ChangeDetectorRef, Component } from '@angular/core';
import { FileSystemService } from '../core/services/file-system.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-big-file-loading',
  templateUrl: './big-file-loading.component.html',
  styleUrl: './big-file-loading.component.scss',
  standalone: false,
})
export class BigFileLoadingComponent {
  private fileLoaderSub?: Subscription;

  visible: boolean = false;
  isTextVisible: boolean = false;

  constructor(
    public fileSystemService: FileSystemService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.fileLoaderSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.fileLoaderSub = this.fileSystemService.fileLoader$.subscribe(
      (data: any) => {
        if (data?.isLoadingDatas) {
          this.visible = true;
        } else {
          this.visible = false;
        }
        if (data?.isBigJsonFile) {
          this.isTextVisible = true;
        }
        this.cdr.detectChanges();
      }
    );
  }
}
