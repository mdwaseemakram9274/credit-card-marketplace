import type { NextApiRequest, NextApiResponse } from 'next';
import { getSupabaseServerClient, hasSupabaseConfig } from '../../../lib/supabase-server';

type StatusResponse = {
  mode: 'cloud' | 'local';
  configured: boolean;
  connected: boolean;
  message: string;
};

export default async function handler(_req: NextApiRequest, res: NextApiResponse<StatusResponse>) {
  if (!hasSupabaseConfig()) {
    return res.status(200).json({
      mode: 'local',
      configured: false,
      connected: false,
      message: 'Supabase is not configured. Writes will use local fallback.',
    });
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('banks').select('id').limit(1);

    if (error) {
      return res.status(200).json({
        mode: 'local',
        configured: true,
        connected: false,
        message: `Supabase configured but unreachable: ${error.message}`,
      });
    }

    return res.status(200).json({
      mode: 'cloud',
      configured: true,
      connected: true,
      message: 'Supabase connected. Writes will go to cloud.',
    });
  } catch (error) {
    return res.status(200).json({
      mode: 'local',
      configured: true,
      connected: false,
      message: error instanceof Error ? error.message : 'Supabase connection failed.',
    });
  }
}
