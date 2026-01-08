import { supabase } from '../lib/supabase';
import { randomUUID } from 'crypto';
import { config } from '../lib/config';

export interface UploadAudioParams {
  userId: string;
  buffer: Buffer;
  filename: string;
  contentType: string;
}

export interface UploadResult {
  bucket: string;
  path: string;
}

export class StorageService {
  /**
   * Generates a namespaced storage path for audio uploads
   * Format: userId/YYYY/MM/DD/<uuid>.<extension>
   */
  private static generateStoragePath(userId: string, filename: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const uuid = randomUUID();

    // Extract extension from filename, default to m4a
    const extension = filename.split('.').pop()?.toLowerCase() || 'm4a';

    return `${userId}/${year}/${month}/${day}/${uuid}.${extension}`;
  }

  /**
   * Uploads audio buffer to Supabase Storage
   */
  static async uploadAudio(params: UploadAudioParams): Promise<UploadResult> {
    const { userId, buffer, filename, contentType } = params;
    const path = this.generateStoragePath(userId, filename);

    try {
      const { error } = await supabase.storage
        .from(config.supabase.bucketAudio)
        .upload(path, buffer, {
          contentType,
          upsert: false, // Don't overwrite existing files
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Failed to upload audio to storage: ${error.message}`);
      }

      console.log(
        `Audio uploaded successfully to ${config.supabase.bucketAudio}/${path}`
      );
      return {
        bucket: config.supabase.bucketAudio,
        path,
      };
    } catch (error) {
      console.error('Storage service upload error:', error);
      throw error;
    }
  }

  /**
   * Creates a signed URL for temporary access to a stored object
   */
  static async createSignedUrl(
    path: string,
    expiresInSeconds = 300
  ): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from(config.supabase.bucketAudio)
        .createSignedUrl(path, expiresInSeconds);

      if (error) {
        console.error('Signed URL creation error:', error);
        throw new Error(`Failed to create signed URL: ${error.message}`);
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Storage service signed URL error:', error);
      throw error;
    }
  }

  /**
   * Deletes an object from Supabase Storage
   */
  static async deleteObject(path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(config.supabase.bucketAudio)
        .remove([path]);

      if (error) {
        console.error('Storage delete error:', error);
        throw new Error(
          `Failed to delete object from storage: ${error.message}`
        );
      }

      console.log(
        `Audio deleted successfully from ${config.supabase.bucketAudio}/${path}`
      );
    } catch (error) {
      console.error('Storage service delete error:', error);
      throw error;
    }
  }

  /**
   * Lists objects in the audio bucket (for debugging/admin purposes)
   */
  static async listObjects(prefix?: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(config.supabase.bucketAudio)
        .list(prefix);

      if (error) {
        console.error('Storage list error:', error);
        throw new Error(`Failed to list objects: ${error.message}`);
      }

      return data?.map((obj) => obj.name) || [];
    } catch (error) {
      console.error('Storage service list error:', error);
      throw error;
    }
  }
}
