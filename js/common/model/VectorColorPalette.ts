// Copyright 2019-2025, University of Colorado Boulder

/**
 * VectorColorPalette defines a set of color for rendering vectors. All vectors in a vector set typically share
 * a VectorColorPalette.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Color from '../../../../scenery/js/util/Color.js';
import vectorAddition from '../../vectorAddition.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';

type VectorColorProperty = TReadOnlyProperty<Color | string | null>;

type VectorColorPaletteOptions = {

  // Colors for main vectors (aka parent vectors)
  vectorFillProperty: VectorColorProperty;
  vectorStrokeProperty?: VectorColorProperty;

  // Colors for component vectors. They are of type DashedArrowNode, which cannot be stroked.
  // Defaults to options.mainFill
  componentFillProperty?: VectorColorProperty;

  // Colors for sum vectors (resultant vectors 'c' and 'f' in the Equations screen)
  sumFillProperty: VectorColorProperty;
  sumStrokeProperty?: VectorColorProperty;

  // Color for sum component vectors (component vectors for resultant vectors 'c' and 'f' in the Equations screen).
  // They are of type DashedArrowNode, which cannot be stroked.
  sumComponentFillProperty?: VectorColorProperty;

  // Colors for base vectors
  baseVectorFillProperty?: VectorColorProperty;
  baseVectorStrokeProperty?: VectorColorProperty;
};

export default class VectorColorPalette {

  public readonly vectorFillProperty: VectorColorProperty;
  public readonly vectorStrokeProperty: VectorColorProperty;
  public readonly componentFillProperty: VectorColorProperty;
  public readonly sumFillProperty: VectorColorProperty;
  public readonly sumStrokeProperty: VectorColorProperty;
  public readonly sumComponentFillProperty: VectorColorProperty;
  public readonly baseVectorFillProperty: VectorColorProperty;
  public readonly baseVectorStrokeProperty: VectorColorProperty;

  public constructor( options: VectorColorPaletteOptions ) {

    this.vectorFillProperty = options.vectorFillProperty;
    this.vectorStrokeProperty = ( options.vectorStrokeProperty || new Property( null ) );
    this.componentFillProperty = ( options.componentFillProperty || options.vectorFillProperty );
    this.sumFillProperty = options.sumFillProperty;
    this.sumStrokeProperty = ( options.sumStrokeProperty || new Property( null ) );
    this.sumComponentFillProperty = ( options.sumComponentFillProperty || options.sumFillProperty );
    this.baseVectorFillProperty = ( options.baseVectorFillProperty || new Property<Color>( Color.WHITE ) );
    this.baseVectorStrokeProperty = ( options.baseVectorStrokeProperty || options.vectorFillProperty );
  }
}

vectorAddition.register( 'VectorColorPalette', VectorColorPalette );