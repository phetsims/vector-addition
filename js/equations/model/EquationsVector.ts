// Copyright 2019-2025, University of Colorado Boulder

/**
 * EquationsVector is a specialization of Vector for the 'Equations' screen.  It adds mutable coefficient and base vector.
 * Instances exist for the lifetime of the sim and do not need to be disposed.
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import BaseVector from '../../common/model/BaseVector.js';
import CartesianBaseVector from '../../common/model/CartesianBaseVector.js';
import PolarBaseVector from '../../common/model/PolarBaseVector.js';
import { LabelDisplayData } from '../../common/model/RootVector.js';
import Vector, { VectorOptions } from '../../common/model/Vector.js';
import vectorAddition from '../../vectorAddition.js';
import EquationsScene from './EquationsScene.js';
import EquationsVectorSet from './EquationsVectorSet.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

// initial coefficient and range
const DEFAULT_COEFFICIENT = 1;
const COEFFICIENT_RANGE = new Range( -5, 5 );

type SelfOptions = EmptySelfOptions;

type EquationsVectorOptions = SelfOptions & PickRequired<VectorOptions, 'symbolProperty' | 'tandem' | 'tandemNameSymbol'>;

export default class EquationsVector extends Vector {

  public readonly coefficientProperty: NumberProperty;
  public readonly baseVector: BaseVector;

  /**
   * @param tailPosition - initial tail position of the vector
   * @param xyComponents - initial xy-components of the vector
   * @param baseVectorTailPosition - starting tail position of the base vector
   * @param scene - the scene the vector belongs to
   * @param vectorSet - the VectorSet that the vector belongs to
   * @param providedOptions
   */
  public constructor( tailPosition: Vector2,
                      xyComponents: Vector2,
                      baseVectorTailPosition: Vector2,
                      scene: EquationsScene,
                      vectorSet: EquationsVectorSet,
                      providedOptions: EquationsVectorOptions ) {

    const options = optionize<EquationsVectorOptions, SelfOptions, VectorOptions>()( {
      isRemovableFromGraph: false, // Equations vectors are not removable from the graph
      isTipDraggable: false, // Equations vectors are not draggable by the tip
      isOnGraph: true, // Equations vectors are always on the graph
      isOnGraphPropertyInstrumented: false // Equations vectors are always on the graph
    }, providedOptions );

    super( tailPosition, xyComponents, scene, vectorSet, options );

    this.coefficientProperty = new NumberProperty( DEFAULT_COEFFICIENT, {
      range: COEFFICIENT_RANGE,
      tandem: options.tandem.createTandem( 'coefficientProperty' )
    } );

    // Set the tip to itself to ensure Invariants for Polar/Cartesian is satisfied.
    this.setTipWithInvariants( this.tip );

    // Instantiate a base vector.
    if ( scene.coordinateSnapMode === 'cartesian' ) {
      this.baseVector = new CartesianBaseVector( baseVectorTailPosition, this.xyComponents.dividedScalar( DEFAULT_COEFFICIENT ), scene, vectorSet, {
        symbolProperty: options.symbolProperty,
        tandemNameSymbol: options.tandemNameSymbol,
        tandem: options.tandem.createTandem( 'baseVector' )
      } );
    }
    else {
      this.baseVector = new PolarBaseVector( baseVectorTailPosition, this.xyComponents.dividedScalar( DEFAULT_COEFFICIENT ), scene, vectorSet, {
        symbolProperty: options.symbolProperty,
        tandemNameSymbol: options.tandemNameSymbol,
        tandem: options.tandem.createTandem( 'baseVector' )
      } );
    }

    // Observe when the base vector changes, or when the coefficient Property changes and update the vector.
    Multilink.multilink( [ this.baseVector.xyComponentsProperty, this.coefficientProperty ],
      ( xyComponents, coefficient ) => {
        this.xyComponentsProperty.value = xyComponents.timesScalar( coefficient );
      } );
  }

  public override reset(): void {
    this.coefficientProperty.reset();
    this.baseVector.reset();
    super.reset();
  }

  /**
   * Vectors in the Equations screen have an associated coefficient.
   * See RootVector.getLabelDisplayData for details.
   */
  public override getLabelDisplayData( valuesVisible: boolean ): LabelDisplayData {
    return combineOptions<LabelDisplayData>( super.getLabelDisplayData( valuesVisible ), {
      coefficient: this.coefficientProperty.value
    } );
  }
}

vectorAddition.register( 'EquationsVector', EquationsVector );